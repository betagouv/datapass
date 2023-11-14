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
    if event_name.start_with?("opinion_comment_")
      context.opinion_comment
    elsif event_name.start_with?("opinion_")
      context.opinion
    end
  end

  def event_name
    context.event_name
  end
end
