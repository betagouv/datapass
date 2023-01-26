# frozen_string_literal: true

RSpec.describe HubeePortailBridge, type: :bridge do
  subject { described_class.new(enrollment).call }

  let(:enrollment) { create(:enrollment, :hubee_portail, :validated, created_at: DateTime.new(2023, 1, 28), updated_at: DateTime.new(2023, 1, 29)) }
  let(:event) { create(:event, name: "validate", enrollment: enrollment, comment: comment, created_at: DateTime.new(2023, 1, 29), updated_at: DateTime.new(2023, 1, 29)) }
  let(:comment) { "I like trains" }

  before do
    stub_hubee_portail_bridge_call
  end

  context "when bridge is called once" do
    it "#create_enrollment_in_token_manager returns an array" do
      subscription_ids = []
      subscription_id = stub_hubee_portail_bridge_call.response.body
      subscription_ids << subscription_id

      expect(stub_hubee_portail_bridge_call).to have_been_requested
      expect(subscription_ids).to eq(["1234567890"])
      expect(subject).to have_requested(:post, "#{ENV.fetch("HUBEE_HOST")}/referential/v1/subscriptions")
        .with { |req| req.body == "1234567890" }
    end
  end

  describe "#validate" do
    xit "delivers a return receipt email to current user" do
      expect {
        subject
      }.to change(ActionMailer::Base.deliveries, :count).by(1)

      last_email = ActionMailer::Base.deliveries.last

      expect(last_email.to).to eq([user.email])
      expect(last_email.body).to include(create_email_sample)
    end
  end
end
