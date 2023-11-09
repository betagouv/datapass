class OpinionComment::NotifyInstructor < ApplicationInteractor
  def call
    OpinionMailer.with(opinion_comment:).comment.deliver_later
  end

  private

  def opinion_comment
    context.opinion_comment
  end
end
