class Opinion::CloseActiveOpinion < ApplicationInteractor
  def call
    context.previous_active_opinion = enrollment.active_opinion

    return if context.previous_active_opinion.blank?

    context.previous_active_opinion.update!(open: false)
  end

  def rollback
    return if context.previous_active_opinion.blank?

    context.previous_active_opinion.update!(open: true)
  end

  private

  def enrollment
    context.enrollment
  end
end
