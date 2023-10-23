class EnrollmentsEmailTemplatesController < AuthenticatedUserController
  def index
    @enrollment = Enrollment.find(params[:id])
    authorize @enrollment, :get_email_templates?

    render json: EnrollmentEmailTemplatesRetriever.new(@enrollment, current_user).perform,
      each_serializer: EnrollmentEmailTemplateSerializer,
      adapter: :json,
      root: "email_templates",
      status: :ok
  end
end
