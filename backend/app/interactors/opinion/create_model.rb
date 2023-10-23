class Opinion::CreateModel < ApplicationInteractor
  def call
    context.opinion = enrollment.opinions.create!(opinion_params)
  end

  private

  def enrollment
    context.enrollment
  end

  def opinion_params
    context.opinion_params
  end
end
