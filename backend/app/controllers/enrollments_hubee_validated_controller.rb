class EnrollmentsHubeeValidatedController < ApplicationController
  before_action :authenticate_user!

  def index
    # note that this controller use a custom policy scope based on the siret
    @enrollments = EnrollmentPolicy::OrganizationScope.new(current_user, Enrollment).resolve
    @enrollments = @enrollments
      .where(target_api: %w[hubee_portail hubee_portail_dila])
      .where(status: "validated")

    render json: @enrollments,
      each_serializer: EnrollmentHubeeValidatedSerializer,
      adapter: :json,
      root: "enrollments",
      status: :ok
  end
end
