shared_examples "notifier webhook delivery" do
  before do
    Timecop.freeze
  end

  after do
    Timecop.return
  end

  it "calls webhook" do
    expect(DeliverEnrollmentWebhookWorker).to receive(:perform_async).with(
      enrollment.target_api,
      WebhookSerializer.new(
        enrollment,
        event
      ).serializable_hash.to_json,
      enrollment.id
    )

    subject
  end
end
