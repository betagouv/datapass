class Enrollment::ExecuteTransition < ApplicationInteractor
  def call
    result = context.enrollment.public_send("#{context.enrollment_transition}_status", transition_params)
    context.fail!(errors: context.enrollment.errors.full_messages) unless result
  end

  private

  def transition_params
    {
      user_id: context.user.id,
      comment: context.comment
    }
  end
end
