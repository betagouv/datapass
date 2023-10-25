class Opinion::CreateModel < ApplicationInteractor
  def call
    context.opinion = enrollment.opinions.new(opinion_params)
    context.opinion.save

    context.fail! unless context.opinion.persisted?
  end

  private

  def enrollment
    context.enrollment
  end

  def opinion_params
    context.opinion_params
  end
end
