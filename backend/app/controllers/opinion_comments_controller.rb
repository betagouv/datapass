class OpinionCommentsController < AuthenticatedUserController
  def create
    authorize(opinion, :comment?)

    organizer = CreateOpinionComment.call(
      opinion: opinion,
      current_user: current_user,
      opinion_comment_params: opinion_comment_create_params
    )

    if organizer.success?
      render json: opinion, status: :created
    else
      render json: organizer.opinion_comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    opinion_comment = OpinionComment.where(id: params[:id], opinion_id: opinion.id).first

    authorize(opinion_comment, :destroy_comment?, policy_class: OpinionPolicy)

    opinion_comment.destroy!

    render json: opinion
  end

  private

  def opinion
    @opinion ||= enrollment.opinions.find(params[:opinion_id])
  end

  def enrollment
    @enrollment ||= Enrollment.find(params[:enrollment_id])
  end

  def opinion_comment_create_params
    params.require(:opinion_comment).permit(:content)
  end
end
