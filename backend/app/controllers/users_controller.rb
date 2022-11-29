class UsersController < ApplicationController
  before_action :authenticate_user!, except: %w[join_organization personal_information]

  def index
    @users = policy_scope(User).order(:email)

    users_with_roles_only = params[:users_with_roles_only]

    if users_with_roles_only == "true"
      @users = @users.with_at_least_one_role
    end

    filter = params[:filter]

    if filter.present?
      begin
        parsed_filter = JSON.parse(filter)
        parsed_filter.each do |filter_item|
          filter_item.each do |filter_key, filter_value|
            next unless %w[email].include? filter_key
            is_fuzzy = %w[email].include? filter_key
            filter_value = [filter_value] unless filter_value.is_a?(Array)
            sanitized_filter_value = filter_value.map { |f| Regexp.escape(f) }
            san_fil_val_without_accent = sanitized_filter_value.map { |f| ActiveSupport::Inflector.transliterate(f, " ") }.join("|")
            next if san_fil_val_without_accent == ""

            sanitized_filter_key = "\"users\".\"#{filter_key}\""

            @users = @users.where(
              "#{sanitized_filter_key}::varchar(255) ~* ?",
              is_fuzzy ? ".*(#{san_fil_val_without_accent}).*" : "^(#{san_fil_val_without_accent})$"
            )
          end
        end
      rescue JSON::ParserError
        # silently fail, if the sort is not formatted properly we do not apply it
      end
    end

    page = params[:page] || 0
    per_page = params[:per_page] || 10
    per_page = "100" if per_page.to_i > 100
    @users = @users.page(page.to_i + 1).per(per_page.to_i)

    render json: @users,
      each_serializer: AdminUserSerializer,
      meta: pagination_dict(@users),
      adapter: :json
  end

  def update
    @user = authorize User.find(params[:id])
    @user.update!(permitted_attributes(@user))

    render json: @user, serializer: AdminUserSerializer
  end

  def create
    @user = User.new
    authorize @user
    @user.email = params[:email]
    @user.update(permitted_attributes(@user))
    @user.save!

    render json: @user, serializer: AdminUserSerializer
  end

  # GET /users/me
  def me
    user = User.new current_user.attributes
    render json: user,
      serializer: FullUserSerializer
  end

  # GET /users/join_organization
  def join_organization
    # we clear DataPass session here to trigger organization sync with moncomptepro
    clear_user_session!
    redirect_to "#{ENV.fetch("OAUTH_HOST")}/users/join-organization", allow_other_host: true
  end

  # GET /users/personal_information
  def personal_information
    # we clear DataPass session here to trigger organization sync with moncomptepro
    clear_user_session!
    redirect_to "#{ENV.fetch("OAUTH_HOST")}/users/personal-information", allow_other_host: true
  end

  private

  def pundit_params_for(_record)
    params.fetch(:user, {})
  end
end
