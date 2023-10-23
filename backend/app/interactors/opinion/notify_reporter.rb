class Opinion::NotifyReporter < ApplicationInteractor
  def call
    OpinionMailer.with(opinion:).create.deliver_later
  end

  private

  def opinion
    context.opinion
  end
end
