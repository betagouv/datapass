class OpinionComment::CreateModel < ApplicationInteractor
  def call
    context.opinion_comment = opinion.comments.create!(opinion_comment_params)
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
