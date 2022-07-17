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
      event.to_s,
      {
        external_token_id: @enrollment.linked_token_manager_id
      }
    ).serializable_hash
  end
end
