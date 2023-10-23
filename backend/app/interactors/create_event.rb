class CreateEvent < ApplicationInteractor
  def call
    context.event = Event.create!(
      enrollment: context.enrollment,
      user: context.current_user,
      name: context.event_name,
      entity: possible_entity
    )
  end

  private

  def possible_entity
    if context.event_name.start_with?("opinion_")
      context.opinion
    end
  end
end
