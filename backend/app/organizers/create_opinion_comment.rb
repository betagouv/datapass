class CreateOpinionComment < ApplicationOrganizer
  before do
    context.event_name = "opinion_comment_created"
    context.enrollment = context.opinion.enrollment
  end

  organize OpinionComment::CreateModel,
    CreateEvent,
    OpinionComment::NotifyInstructor
end
