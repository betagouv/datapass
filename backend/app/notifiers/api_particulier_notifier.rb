class ApiParticulierNotifier < BaseNotifier
  include WebhookNotifierMethods

  def validate(comment:, current_user:)
    super

    deliver_event_webhook(__method__)
  end
end
