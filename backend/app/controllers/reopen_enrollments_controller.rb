class ReopenEnrollmentsController < AuthenticatedUserController
  def update
    authorize enrollment, :reopen?

    organizer = ReopenEnrollment.call(
      enrollment: enrollment,
      user: current_user
    )

    if organizer.success?
      render json: enrollment, status: :ok
    else
      render json: {errors: organizer.errors}, status: :unprocessable_entity
    end
  end

  private

  def enrollment
    @enrollment ||= Enrollment.find(params[:id])
  end
end
