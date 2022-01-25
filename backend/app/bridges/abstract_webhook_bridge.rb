class AbstractWebhookBridge < ApplicationBridge
  def call
    DeliverEnrollmentWebhookWorker.perform_async(
      @enrollment.target_api,
      webhook_payload,
      @enrollment.id
    )
  end

  private

  def webhook_payload
    WebhookSerializer.new(
      @enrollment,
      "validated"
    ).serializable_hash
  end
end
