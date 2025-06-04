# frozen_string_literal: true

class EnrollmentsController < AuthenticatedUserController
  RESPONSABLE_TRAITEMENT_LABEL = "responsable de traitement"
  DELEGUE_PROTECTION_DONNEES_LABEL = "délégué à la protection des données"

  skip_before_action :authenticate_user!, only: [:public]
  before_action :early_return, only: %i[create update change_state]

  # GET /enrollments
  def index
    @enrollments = policy_scope(Enrollment)

    @enrollments = @enrollments.where(target_api: params[:target_api]) if params[:target_api].present?

    begin
      sorted_by = JSON.parse(params[:sortedBy] || "[]")
      sorted_by.each do |sort_item|
        sort_item.each do |sort_key, sort_direction|
          next unless ["updated_at"].include? sort_key
          next unless %w[asc desc].include? sort_direction

          @enrollments = @enrollments.order("\"enrollments\".\"#{sort_key}\" #{sort_direction.upcase}")
        end
      end
    rescue JSON::ParserError
      # silently fail, if the sort is not formatted properly we do not apply it
    end

    begin
      @enrollments = FilterService.call(params, @enrollments)
    rescue JSON::ParserError
      # silently fail, if the filter is not formatted properly we do not apply it
    end

    page = params[:page] || 0
    max_per_page = params[:max_per_page] || 10
    max_per_page = "100" if max_per_page.to_i > 100
    @enrollments = @enrollments.page(page.to_i + 1).per(max_per_page.to_i)

    serializer = LightEnrollmentSerializer

    serializer = EnrollmentSerializer if params[:detailed].present?

    render json: @enrollments,
      each_serializer: serializer,
      meta: pagination_dict(@enrollments),
      adapter: :json,
      root: "enrollments"
  end

  # GET /enrollments/1
  def show
    @enrollment = authorize Enrollment.find(params[:id])
    @enrollment.mark_event_as_processed("submit") unless @enrollment.consulted_by_instructor?
    render json: @enrollment
  end

  # GET /enrollments/user
  def user
    # set an arbitrary limit to 100 to mitigate DDOS on this endpoint
    # we do not expect a user to have more than 100 enrollments within less than 4 organisations
    @enrollments = policy_scope(Enrollment)
      .order(updated_at: :desc)
      .limit(100)
    render json: @enrollments, each_serializer: UserEnrollmentListSerializer
  end

  # GET /enrollments/public
  def public
    @enrollments = Enrollment
      .where(status: "validated")
      .order(updated_at: :desc)

    begin
      @enrollments = FilterService.call(params, @enrollments)
    rescue JSON::ParserError
      # silently fail, if the filter is not formatted properly we do not apply it
    end

    page = params[:page] || 0
    max_per_page = params[:max_per_page] || 10
    max_per_page = "100" if max_per_page.to_i > 100
    @enrollments = @enrollments.page(page.to_i + 1).per(max_per_page.to_i)

    render json: @enrollments,
      each_serializer: PublicEnrollmentListSerializer,
      meta: pagination_dict(@enrollments),
      adapter: :json,
      root: "enrollments"
  end

  # POST /enrollments
  def create
    target_api = params.fetch(:enrollment, {})["target_api"]
    unless DataProviderConfigurations.instance.exists?(target_api)
      raise ApplicationController::UnprocessableEntity,
        "Une erreur inattendue est survenue: fournisseur de données inconnu. Aucun changement n’a été sauvegardé."
    end

    enrollment_class = "Enrollment::#{target_api.underscore.classify}".constantize
    @enrollment = enrollment_class.new

    @enrollment.assign_attributes(
      format_enrollment_param(permitted_attributes(@enrollment))
    )
    authorize @enrollment

    @enrollment.save!
    @enrollment.events.create(name: "create", user_id: current_user.id)
    @enrollment.notify_event("create")

    render json: @enrollment
  end

  # PATCH/PUT /enrollments/1
  def update
    @enrollment = authorize Enrollment.find(params[:id])
    @enrollment.update!(
      format_enrollment_param(permitted_attributes(@enrollment))
    )
    @enrollment.events.create(name: "update", user_id: current_user.id, diff: @enrollment.diff_with_associations)
    @enrollment.notify_event("update", user_id: current_user.id, diff: @enrollment.diff_with_associations)

    render json: @enrollment
  end

  # PATCH /enrollment/1/change_state
  def change_state
    event = params[:event]
    unless Enrollment.state_machine.events.map(&:name).include?(event.to_sym)
      return render status: :bad_request, json: {
        message: ["event not permitted"]
      }
    end
    @enrollment = authorize Enrollment.find(params[:id]), :"#{event}?"

    # We update userinfo when "event" is "submit".
    # This is useful to prevent user that has been removed from organization, or has been deactivated
    # since first login, to submit authorization request illegitimately
    # Note that this feature need the access token to be stored in a clientside
    # sessions. This might be considered as a security weakness.
    if event == "submit"
      begin
        refreshed_user = RefreshUser.call(session[:access_token])

        unless refreshed_user.email_verified
          raise ApplicationController::Forbidden,
            "L’accès à votre adresse email n’a pas pu être vérifié. Merci de vous rendre sur #{ENV.fetch("OAUTH_HOST")}/users/verify-email puis de cliquer sur 'Me renvoyer un code de confirmation'"
        end

        selected_organization = refreshed_user.organizations.find { |o| o["id"] == @enrollment.organization_id }
        if selected_organization.nil?
          raise ApplicationController::Forbidden,
            "Vous ne pouvez pas demander une habilitation pour une organisation à laquelle vous n’appartenez pas. Merci de vous rendre sur #{ENV.fetch("OAUTH_HOST")}/users/join-organization?siret_hint=#{@enrollment.siret} puis de cliquer sur 'Rejoindre l’organisation'"
        end
      rescue ApplicationController::BadGateway => e
        raise if e.http_code != 401

        # we force the logout so the token and user info can be refreshed.
        clear_user_session!
        raise ApplicationController::Unauthorized
      end
    end

    @enrollment.mark_event_as_processed("notify") if current_user.is_instructor?(@enrollment.target_api)

    if @enrollment.send(
      :"#{event}_status",
      user_id: current_user.id,
      comment: params[:comment]
    )
      if event != "archive"
        @enrollment.notify_event(
          event,
          comment: params[:comment],
          current_user:
        )
      end
      render json: @enrollment
    else
      render status: :unprocessable_entity, json: @enrollment.errors
    end
  end

  # POST /enrollment/1/copy
  def copy
    @enrollment = authorize Enrollment.find(params[:id])
    copied_enrollment = @enrollment.copy current_user

    if copied_enrollment.valid?
      render json: copied_enrollment
    else
      render_model_errors(title: "Cette demande a déjà été copiée", model: copied_enrollment)
    end
  end

  # GET enrollments/1/copies
  def copies
    @enrollments = policy_scope(Enrollment)
      .where(copied_from_enrollment_id: params[:id])
    render json: @enrollments,
      each_serializer: LightEnrollmentSerializer,
      adapter: :json,
      root: "enrollments"
  end

  # GET enrollments/1/next_enrollments
  def next_enrollments
    @enrollments = policy_scope(Enrollment)
      .where(previous_enrollment_id: params[:id])
    render json: @enrollments,
      each_serializer: LightEnrollmentSerializer,
      adapter: :json,
      root: "enrollments"
  end

  # GET enrollment/1/mark_event_as_read
  def mark_event_as_processed
    @enrollment = authorize Enrollment.find(params[:id])
    @enrollment.mark_event_as_processed(params[:event_name])

    render json: @enrollment
  end

  private

  def pundit_params_for(_record)
    params.fetch(:enrollment, {})
  end

  def format_enrollment_param(enrollment_param)
    # we need to convert boolean values as it is send as string because of the
    # data-form serialisation then we convert scopes to array
    enrollment_param["scopes"] =
      enrollment_param["scopes"].to_h.select { |_k, v| v == "true" }.keys
    # in a similar way, format additional boolean content
    enrollment_param["additional_content"] =
      (enrollment_param["additional_content"] || {}).transform_values do |value|
        case value.to_s
        when "true"
          true
        when "false"
          false
        else
          value
        end
      end

    enrollment_param
  end

  def early_return
    return unless Rails.env.production?

    render json: {}, status: :gone
  end
end
