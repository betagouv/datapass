require "http"
require "openssl"

class DeliverEnrollmentWebhookWorker < ApplicationWorker
  sidekiq_options queue: "webhooks"

  def perform(target_api, json, enrollment_id, tries_count = 0)
    return if webhook_url(target_api).blank?
    return if verify_token(target_api).blank?

    payload = JSON.parse(json)

    response = request(target_api, payload)

    if success_http_codes.include?(response.status)
      handle_success(response.body, enrollment_id)
    else
      handle_error(response, target_api, payload, enrollment_id, tries_count)
    end
  end

  private

  def request(target_api, payload)
    HTTP
      .headers(
        "Content-Type" => "application/json",
        "X-Hub-Signature-256" => "sha256=#{generate_hub_signature(target_api, payload)}"
      )
      .post(
        webhook_url(target_api),
        json: payload
      )
  end

  def handle_success(payload, enrollment_id)
    json = JSON.parse(payload)

    return unless json["token_id"].present?

    Enrollment.find(enrollment_id).update(
      linked_token_manager_id: json["token_id"]
    )
  rescue JSON::ParserError
    nil
  end

  def handle_error(response, target_api, payload, enrollment_id, tries_count)
    track_error(response, target_api, payload, tries_count)
    notify_webhook_fail(target_api, payload, response) if tries_count == 4
    reschedule_worker(target_api, payload, enrollment_id, tries_count)
  end

  def reschedule_worker(target_api, payload, enrollment_id, tries_count)
    self.class.perform_in(
      extract_waiting_time(tries_count),
      target_api,
      payload,
      enrollment_id,
      tries_count + 1
    )
  end

  def track_error(response, target_api, payload, tries_count)
    Sentry.set_extras(
      {
        target_api: target_api,
        payload: payload,
        tries_count: tries_count,
        webhook_response_status: response.status,
        webhook_response_body: response.body
      }
    )

    Sentry.capture_message("Fail to call target's api webhook endpoint")
  end

  def notify_webhook_fail(target_api, payload, response)
    WebhookMailer.with(
      target_api: target_api,
      payload: payload,
      webhook_response_status: response.status.to_i,
      webhook_response_body: response.body.to_s
    ).fail.deliver_later
  end

  # https://github.com/mperham/sidekiq/wiki/Error-Handling#automatic-job-retry
  def extract_waiting_time(tries_count)
    (tries_count**4) + 15 + (rand(30) * (tries_count + 1))
  end

  def generate_hub_signature(target_api, payload)
    OpenSSL::HMAC.hexdigest(
      OpenSSL::Digest.new("sha256"),
      verify_token(target_api),
      payload.to_json
    )
  end

  def webhook_url(target_api)
    ENV["#{target_api.upcase}_WEBHOOK_URL"]
  end

  def verify_token(target_api)
    ENV["#{target_api.upcase}_VERIFY_TOKEN"]
  end

  def success_http_codes
    [
      200,
      201,
      204
    ]
  end
end
