class EnrollmentsController < ApplicationController
  RESPONSABLE_TRAITEMENT_LABEL = "responsable de traitement"
  DELEGUE_PROTECTION_DONNEES_LABEL = "délégué à la protection des données"

  before_action :authenticate_user!, except: [:public]

  # GET /enrollments
  def index
    @enrollments = policy_scope(Enrollment)
    if params.fetch(:target_api, false)
      @enrollments = @enrollments.where(target_api: params.fetch(:target_api, false))
    end

    begin
      sorted_by = JSON.parse(params.fetch(:sortedBy, "[]"))
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
      filter = JSON.parse(params.fetch(:filter, "[]"))
      filter.each do |filter_item|
        filter_item.each do |filter_key, filter_value|
          next unless %w[id siret nom_raison_sociale target_api status team_members.email].include? filter_key
          is_fuzzy = %w[id siret nom_raison_sociale team_members.email].include? filter_key
          filter_value = [filter_value] unless filter_value.is_a?(Array)
          sanitized_filter_value = filter_value.map { |f| Regexp.escape(f) }
          san_fil_val_without_accent = sanitized_filter_value.map { |f| ActiveSupport::Inflector.transliterate(f, " ") }.join("|")
          next if san_fil_val_without_accent == ""

          if filter_key.start_with? "team_members."
            @enrollments = @enrollments.includes(:team_members)
            sanitized_filter_key = filter_key.split(".").map { |e| "\"#{e}\"" }.join(".")
          else
            sanitized_filter_key = "\"enrollments\".\"#{filter_key}\""
          end

          @enrollments = @enrollments.where(
            "#{sanitized_filter_key}::varchar(255) ~* ?",
            is_fuzzy ? ".*(#{san_fil_val_without_accent}).*" : "^(#{san_fil_val_without_accent})$"
          )
        end
      end
    rescue JSON::ParserError
      # silently fail, if the filter is not formatted properly we do not apply it
    end

    page = params.fetch(:page, "0")
    size = params.fetch(:size, "10")
    size = "100" if size.to_i > 100
    @enrollments = @enrollments.page(page.to_i + 1).per(size.to_i)

    serializer = LightEnrollmentSerializer

    if params.fetch(:detailed, false)
      serializer = EnrollmentSerializer
    end

    render json: @enrollments,
      each_serializer: serializer,
      meta: pagination_dict(@enrollments),
      adapter: :json,
      root: "enrollments"
  end

  # GET /enrollments/export
  def export
    @enrollments = policy_scope(Enrollment)

    send_data @enrollments.to_csv, filename: "export-datapass-#{Date.today}.csv"
  end

  # GET /enrollments/1
  def show
    @enrollment = authorize Enrollment.find(params[:id])
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

    @enrollments = @enrollments.where(target_api: params.fetch(:target_api, false)) if params.fetch(:target_api, false)

    page = params.fetch(:page, "0")
    size = params.fetch(:size, "10")
    size = "100" if size.to_i > 100
    @enrollments = @enrollments.page(page.to_i + 1).per(size.to_i)

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
      raise ApplicationController::UnprocessableEntity, "Une erreur inattendue est survenue: fournisseur de données inconnu. Aucun changement n’a été sauvegardé."
    end
    enrollment_class = "Enrollment::#{target_api.underscore.classify}".constantize
    @enrollment = enrollment_class.new

    @enrollment.assign_attributes(permitted_attributes(@enrollment))
    authorize @enrollment

    @enrollment.save!
    @enrollment.events.create(name: "create", user_id: current_user.id)
    @enrollment.notify_event("create")

    render json: @enrollment
  end

  # PATCH/PUT /enrollments/1
  def update
    @enrollment = authorize Enrollment.find(params[:id])
    @enrollment.update!(permitted_attributes(@enrollment))
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
    @enrollment = authorize Enrollment.find(params[:id]), "#{event}?".to_sym

    # We update userinfo when "event" is "submit".
    # This is useful to prevent user that has been removed from organization, or has been deactivated
    # since first login, to submit authorization request illegitimately
    # Note that this feature need the access token to be stored in a clientside
    # sessions. This might be considered as a security weakness.
    if event == "submit"
      begin
        refreshed_user = RefreshUser.call(session[:access_token])

        unless refreshed_user.email_verified
          raise ApplicationController::Forbidden, "L’accès à votre adresse email n’a pas pu être vérifié. Merci de vous rendre sur #{ENV.fetch("OAUTH_HOST")}/users/verify-email puis de cliquer sur 'Me renvoyer un code de confirmation'"
        end
        selected_organization = refreshed_user.organizations.find { |o| o["id"] == @enrollment.organization_id }
        if selected_organization.nil?
          raise ApplicationController::Forbidden, "Vous ne pouvez pas demander une habilitation pour une organisation à laquelle vous n’appartenez pas. Merci de vous rendre sur #{ENV.fetch("OAUTH_HOST")}/users/join-organization?siret_hint=#{@enrollment.siret} puis de cliquer sur 'Rejoindre l’organisation'"
        end
      rescue ApplicationController::BadGateway => e
        if e.http_code != 401
          raise
        end

        # we force the logout so the token and user info can be refreshed.
        clear_user_session!
        raise ApplicationController::Unauthorized
      end
    end

    if current_user.is_instructor?(@enrollment.target_api)
      @enrollment.mark_demandeur_notify_events_as_processed
    end

    if @enrollment.send(
      "#{event}_status".to_sym,
      user_id: current_user.id,
      comment: params[:comment]
    )
      @enrollment.notify_event(
        event,
        comment: params[:comment],
        current_user: current_user
      )

      render json: @enrollment
    else
      render status: :unprocessable_entity, json: @enrollment.errors
    end
  end

  # POST /enrollment/1/copy
  def copy
    @enrollment = authorize Enrollment.find(params[:id])
    copied_enrollment = @enrollment.copy current_user
    render json: copied_enrollment
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

  # GET enrollment/1/mark_demandeur_notify_events_as_processed
  def mark_demandeur_notify_events_as_processed
    @enrollment = authorize Enrollment.find(params[:id])

    @enrollment.mark_demandeur_notify_events_as_processed
    render json: @enrollment
  end

  def destroy
    @enrollment = authorize Enrollment.find(params[:id])
    @enrollment.destroy

    render status: :ok
  end

  private

  def pundit_params_for(_record)
    params.fetch(:enrollment, {})
  end
end
