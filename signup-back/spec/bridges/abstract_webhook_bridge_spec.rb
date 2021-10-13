require "rails_helper"

RSpec.describe AbstractWebhookBridge, type: :bridge do
  let(:dummy_webhook_bridge) do
    Class.new(AbstractWebhookBridge)
  end

  subject { dummy_webhook_bridge.call(enrollment) }

  let(:enrollment) { create(:enrollment, :franceconnect, :validated) }
  let(:webhook_payload) { WebhookSerializer.new(enrollment, "validated").serializable_hash }

  before do
    Timecop.freeze
  end

  after do
    Timecop.return
  end

  it "calls DeliverEnrollmentWebhookWorker with enrollment's target api and valid payload" do
    expect(DeliverEnrollmentWebhookWorker).to receive(:perform_async).with(
      enrollment.target_api,
      webhook_payload,
      enrollment.id
    )

    subject
  end
end
