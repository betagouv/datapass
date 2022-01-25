class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = policy_scope(User).order(:email)

    if users_with_roles_only?
      @users = @users.with_at_least_one_role
    end

    render json: @users,
      each_serializer: AdminUserSerializer,
      adapter: :json
  end

  def update
    @user = authorize User.find(params[:id])

    if @user.update(permitted_attributes(@user))
      render json: @user,
        serializer: AdminUserSerializer
    else
      render json: @user.errors,
        status: :unprocessable_entity
    end
  end

  def create
    @user = User.new
    @user.email = params[:email]
    @user.update(permitted_attributes(@user))
    authorize @user

    if @user.save
      render json: @user,
        serializer: AdminUserSerializer
    else
      render json: @user.errors,
        status: :unprocessable_entity
    end
  end

  # GET /users/me
  def me
    user = User.new current_user.attributes
    render json: user,
      serializer: FullUserSerializer
  end

  # GET /users/join_organization
  def join_organization
    # we clear DataPass session here to trigger organization sync with api-auth
    clear_user_session!
    redirect_to "#{ENV.fetch("OAUTH_HOST")}/users/join-organization"
  end

  # GET /users/personal_information
  def personal_information
    # we clear DataPass session here to trigger organization sync with api-auth
    clear_user_session!
    redirect_to "#{ENV.fetch("OAUTH_HOST")}/users/personal-information"
  end

  private

  def pundit_params_for(_record)
    params.fetch(:user, {})
  end

  def users_with_roles_only?
    params.permit(:users_with_roles_only)[:users_with_roles_only] == "true"
  end
end
