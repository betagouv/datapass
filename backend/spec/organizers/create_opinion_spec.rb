RSpec.describe CreateOpinion, type: :organizer do
  include ActiveJob::TestHelper

  subject(:create_opinion) { described_class.call(params) }

  let(:params) do
    {
      enrollment: enrollment,
      opinion_params: opinion_params,
      current_user: user
    }
  end

  let(:enrollment) { create(:enrollment, :api_particulier) }
  let(:opinion_params) { {content: "Give me an advice plz", reporter_id: reporter.id} }
  let(:reporter) { create(:reporter, target_api: "api_particulier") }
  let(:user) { create(:user) }

  context "with invalid params" do
    let(:opinion_params) { {content: nil, reporter_id: reporter.id} }

    it { is_expected.to be_a_failure }

    it "does not create an opinion" do
      expect { create_opinion }.not_to change(Opinion, :count)
    end
  end

  context "with valid params" do
    it { is_expected.to be_success }

    it "creates a new opinion" do
      expect { create_opinion }.to change(Opinion, :count).by(1)

      last_opinion = Opinion.last

      expect(last_opinion.reporter).to eq(reporter)
      expect(last_opinion.enrollment).to eq(enrollment)
      expect(last_opinion.content).to eq("Give me an advice plz")
    end

    it "creates an event linked to this opinion" do
      expect { create_opinion }.to change(Event, :count).by(1)

      last_event = Event.last

      expect(last_event.name).to eq("opinion_created")
      expect(last_event.enrollment).to eq(enrollment)
      expect(last_event.entity).to be_a(Opinion)
      expect(last_event.user).to eq(user)
    end

    it "notifies reporter" do
      perform_enqueued_jobs do
        create_opinion
      end

      expect(ActionMailer::Base.deliveries.count).to eq(1)

      mail = ActionMailer::Base.deliveries.last

      expect(mail.to).to eq([reporter.email])
    end
  end
end
