class CreateOpinion < ApplicationOrganizer
  before do
    context.event_name = "opinion_created"
  end

  organize Opinion::CloseActiveOpinion,
    Opinion::CreateModel,
    CreateEvent,
    Opinion::NotifyReporter
end
