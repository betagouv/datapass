class CreateEvent < ApplicationInteractor
  def call
    context.event = Event.create!(
      enrollment: context.enrollment,
      user: context.current_user,
      name: context.event_name
    )
  end
end
