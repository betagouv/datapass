require "rails_helper"

RSpec.describe DeliverEnrollmentWebhookWorker, type: :worker do
  subject { described_class.perform_async(target_api, payload, enrollment.id) }

  let(:target_api) { "api_entreprise" }
  let(:payload) do
    {
      "lol" => "oki"
    }
  end
  let(:enrollment) { create(:enrollment, :franceconnect) }

  let(:webhook_post_request) do
    stub_request(:post, webhook_url).with(
      body: payload.to_json,
      headers: {
        "Content-Type" => "application/json",
        "X-Hub-Signature-256" => "sha256=#{hub_signature}"
      }
    ).to_return(status: status, body: body)
  end
  let(:status) { [200, 201, 204].sample }
  let(:body) { "whatever" }

  let(:webhook_url) { "https://service.gouv.fr/webhook" }
  let(:verify_token) { "verify_token" }
  let(:hub_signature) do
    OpenSSL::HMAC.hexdigest(
      OpenSSL::Digest.new("sha256"),
      verify_token,
      payload.to_json
    )
  end

  before do
    Timecop.freeze

    webhook_post_request
  end

  after do
    Timecop.return

    ENV["API_ENTREPRISE_WEBHOOK_URL"] = nil
    ENV["API_ENTREPRISE_VERIFY_TOKEN"] = nil
  end

  context "when target api's webhook url is not defined" do
    before do
      ENV["API_ENTREPRISE_VERIFY_TOKEN"] = verify_token
    end

    it "does nothing" do
      subject

      expect(webhook_post_request).not_to have_been_requested
    end
  end

  context "when target api's verify token is not defined" do
    before do
      ENV["API_ENTREPRISE_WEBHOOK_URL"] = webhook_url
    end

    it "does nothing" do
      subject

      expect(webhook_post_request).not_to have_been_requested
    end
  end

  context "when all target api webhook env vars are defined" do
    before do
      ENV["API_ENTREPRISE_WEBHOOK_URL"] = webhook_url
      ENV["API_ENTREPRISE_VERIFY_TOKEN"] = verify_token
    end

    it "performs a post request on target api's webhook url with payload and headers" do
      subject

      expect(webhook_post_request).to have_been_requested
    end

    describe "target's api webhook url status" do
      subject { described_class.perform_async(target_api, payload, enrollment.id, tries_count) }

      before do
        allow(described_class).to receive(:perform_in)
      end

      let(:tries_count) { 0 }

      context "when endpoint respond with a success" do
        it "does not reschedule worker" do
          expect(described_class).not_to receive(:perform_in)

          subject
        end

        it "does not track on sentry" do
          expect(Sentry).not_to receive(:capture_message)

          subject
        end

        context "when body is a json with a token_id key" do
          let(:token_id) { "token_id" }

          let(:body) do
            {
              token_id: token_id
            }.to_json
          end

          it "stores this token id in enrollment" do
            expect {
              subject
            }.to change { enrollment.reload.linked_token_manager_id }.to(token_id)
          end
        end
      end

      context "when endpoint respond with an error (400 to 599 status)" do
        let(:status) { rand(400..599) }

        it "reschedules worker with incremented tries count" do
          expect(described_class).to receive(:perform_in).with(
            instance_of(Integer),
            target_api,
            payload,
            enrollment.id,
            tries_count + 1
          )

          subject
        end

        it "tracks on sentry" do
          expect(Sentry).to receive(:capture_message)

          subject
        end

        context "when tries count is not 4" do
          let(:tries_count) { ([*1..100] - [4]).sample }

          it "does not send an email through WebhookMailer" do
            expect(ActionMailer::MailDeliveryJob).not_to(
              have_been_enqueued.with(
                "WebhookMailer",
                "fail",
                anything,
                {
                  target_api: target_api,
                  payload: payload,
                  webhook_response_status: status,
                  webhook_response_body: body
                }
              )
            )
          end
        end

        context "when tries count is 4 (5th attempt, ~10m)" do
          let(:tries_count) { 4 }

          it "sends an email through WebhookMailer" do
            subject

            expect(ActionMailer::MailDeliveryJob).to(
              have_been_enqueued.with(
                "WebhookMailer",
                "fail",
                anything,
                {
                  target_api: target_api,
                  payload: payload,
                  webhook_response_status: status,
                  webhook_response_body: body
                }
              )
            )
          end
        end
      end
    end
  end
end
