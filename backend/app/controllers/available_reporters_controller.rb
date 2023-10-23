class AvailableReportersController < AuthenticatedUserController
  def index
    authorize params[:target_api], policy_class: AvailableReporterPolicy

    render json: available_reporters,
      status: :ok
  end

  private

  def available_reporters
    User.reporters(params[:target_api])
  end
end
