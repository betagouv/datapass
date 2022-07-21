# frozen_string_literal: true

require "rails_helper"

RSpec.describe "API Particulier: bridge with notifier to API Entreprise", type: :request do
  let(:enrollment) do
    create(
      :enrollment,
      :api_particulier,
      :complete,
      status: :submitted
    )
  end
  let(:token_id) { "over-9000" }
  let(:user) { create(:user, roles: ["api_particulier:instructor"]) }
  let(:stub_api_particulier_token_creation) do
    stub_request(:post, "#{ENV["API_PARTICULIER_HOST"]}/api/applications").and_return(
      headers: {
        "Content-Type" => "application/json"
      },
      body: {
        id: token_id
      }.to_json,
      status: 201
    )
  end

  before do
    login(user)

    ENV["API_PARTICULIER_HOST"] = "http://particulier.api.gouv.local"
    ENV["API_PARTICULIER_API_KEY"] = SecureRandom.uuid

    stub_api_particulier_token_creation
  end

  after do
    ENV["API_PARTICULIER_HOST"] = nil
    ENV["API_PARTICULIER_API_KEY"] = nil
  end

  subject(:validate_enrollment) do
    patch change_state_enrollment_path(id: enrollment.id, event: "validate", comment: "whatever")
    response
  end

  it { is_expected.to have_http_status(:ok) }

  it "calls bridge and update enrollnment with token id" do
    expect {
      validate_enrollment
    }.to change { enrollment.reload.linked_token_manager_id }.to(token_id)
  end

  it "calls webhook with linked token manager id as extra data" do
    expect(DeliverEnrollmentWebhookWorker).to receive(:perform_async).with(
      enrollment.target_api,
      hash_including(
        data: {
          pass: anything,
          external_token_id: token_id
        }
      ),
      enrollment.id
    )

    validate_enrollment
  end
end
