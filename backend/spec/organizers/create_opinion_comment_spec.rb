RSpec.describe CreateOpinionComment, type: :organizer do
  subject(:create_opinion_comment) { described_class.call(params) }

  let(:params) do
    {
      opinion: opinion,
      opinion_comment_params: opinion_comment_params,
      current_user: user
    }
  end

  let(:opinion) { create(:opinion, enrollment:) }
  let(:opinion_comment_params) { {content: "This is an advice"} }
  let(:enrollment) { create(:enrollment, :api_particulier) }
  let(:user) { create(:user, roles: ["api_particulier:reporter"]) }

  context "with valid params" do
    it { is_expected.to be_success }

    it "creates a new opinion comment from current user" do
      expect { create_opinion_comment }.to change(OpinionComment, :count).by(1)

      last_opinion_comment = OpinionComment.last

      expect(last_opinion_comment.user).to eq(user)
      expect(last_opinion_comment.opinion).to eq(opinion)
      expect(last_opinion_comment.content).to eq("This is an advice")
    end

    it "creates an event linked to this opinion comment" do
      expect { create_opinion_comment }.to change(Event, :count).by(1)

      last_event = Event.last

      expect(last_event.name).to eq("opinion_comment_created")
      expect(last_event.enrollment).to eq(enrollment)
      expect(last_event.entity).to be_a(OpinionComment)
      expect(last_event.user).to eq(user)
    end
  end
end
