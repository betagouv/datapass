class OpinionComment::CreateModel < ApplicationInteractor
  def call
    context.opinion_comment = opinion.create_comment(opinion_comment_params)

    context.fail! unless context.opinion_comment.persisted?
  end

  def rollback
    context.opinion_comment.destroy
  end

  private

  def opinion
    context.opinion
  end

  def opinion_comment_params
    context.opinion_comment_params.merge(
      user: context.current_user
    )
  end
end
