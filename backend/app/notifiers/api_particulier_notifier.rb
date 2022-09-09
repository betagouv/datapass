class ApiParticulierNotifier < BaseNotifier
  include WebhookNotifierMethods

  def validate(comment:, current_user:)
    super

    deliver_event_webhook(__method__)
  end

  private

  def webhook_payload_for(event)
    WebhookSerializer.new(
      @enrollment,
      event.to_s
    ).serializable_hash
  end
end
