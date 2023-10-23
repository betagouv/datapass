class OpinionsController < AuthenticatedUserController
  def create
    authorize(enrollment, policy_class: OpinionPolicy)

    organizer = CreateOpinion.call(
      enrollment: enrollment,
      opinion_params: opinion_create_params,
      current_user: current_user
    )

    if organizer.success?
      render json: organizer.opinion, status: :created
    else
      render json: organizer.opinion.errors, status: :unprocessable_entity
    end
  end

  private

  def enrollment
    @enrollment ||= Enrollment.find(params[:enrollment_id])
  end

  def opinion_create_params
    params.require(:opinion).permit(
      :content,
      :reporter_id
    )
  end
end
