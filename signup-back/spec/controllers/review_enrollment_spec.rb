# frozen_string_literal: true

RSpec.describe EnrollmentsController, "review", type: :controller do
  subject(:review_application) do
    patch :trigger, params: {
      id: enrollment.id,
      event: "review_application",
      comment: comment,
      commentFullEditMode: comment_full_edit_mode
    }.compact
  end

  let(:instructor) { create(:user, roles: ["franceconnect:instructor", "franceconnect:reporter"]) }
  let(:enrollment) { create(:enrollment, :sent, :franceconnect) }

  let(:comment) { "Votre application n'est pas valide" }

  before do
    login(instructor)

    ActiveJob::Base.queue_adapter = :inline
  end

  after do
    ActiveJob::Base.queue_adapter = :test
  end

  describe "when admin sends a comment" do
    let(:comment_full_edit_mode) { nil }

    it { expect(response).to have_http_status(:ok) }

    it "sends an email to enrollment's user with comment as body" do
      expect {
        review_application
      }.to change { ActionMailer::Base.deliveries.count }.by(1)

      last_mail = ActionMailer::Base.deliveries.last

      expect(last_mail.body).to eq(comment)
    end
  end
end
