class NotifyEvent < ApplicationInteractor
  def call
    enrollment.notify_event(context.event_name, **context.notifier_params)
  end

  private

  def enrollment
    context.enrollment
  end
end
