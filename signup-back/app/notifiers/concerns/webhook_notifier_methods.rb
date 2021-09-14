module WebhookNotifierMethods
  protected

  def deliver_event_webhook(event)
    DeliverEnrollmentWebhookWorker.perform_async(
      @enrollment.target_api,
      webhook_payload_for(event),
      @enrollment.id
    )
  end

  private

  def webhook_payload_for(event)
    WebhookSerializer.new(
      @enrollment,
      event.to_s
    ).serializable_hash
  end
end
