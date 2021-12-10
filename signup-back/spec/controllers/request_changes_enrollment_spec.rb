# frozen_string_literal: true

RSpec.describe EnrollmentsController, "request_changes", type: :controller do
  subject(:request_changes) do
    patch :change_state, params: {
      id: enrollment.id,
      event: "request_changes",
      comment: comment
    }.compact
  end

  let(:instructor) { create(:user, roles: ["franceconnect:instructor", "franceconnect:reporter"]) }
  let(:enrollment) { create(:enrollment, :submitted, :franceconnect) }

  let(:comment) { "Votre demande n'est pas valide" }

  before do
    login(instructor)

    ActiveJob::Base.queue_adapter = :inline
  end

  after do
    ActiveJob::Base.queue_adapter = :test
  end

  describe "when admin sends a comment" do
    it { expect(response).to have_http_status(:ok) }

    it "sends an email to enrollment's user with comment as body" do
      expect {
        request_changes
      }.to change { ActionMailer::Base.deliveries.count }.by(1)

      last_mail = ActionMailer::Base.deliveries.last

      expect(last_mail.body).to eq(comment)
    end
  end
end
