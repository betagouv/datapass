RSpec.describe WebhookMailer, type: :mailer do
  describe ".fail" do
    subject(:mail) do
      described_class.with(
        target_api: target_api,
        payload: payload,
        webhook_response_status: webhook_response_status,
        webhook_response_body: webhook_response_body
      ).fail
    end

    let(:target_api) { "api_entreprise" }
    let(:payload) { {lol: "oki"} }
    let(:webhook_response_body) { "PANIK" }
    let(:webhook_response_status) { 500 }

    let(:webhook_url) { "https://service.api.gouv.fr/webhook" }

    before do
      ENV["#{target_api.upcase}_WEBHOOK_URL"] = webhook_url
    end

    after do
      ENV["#{target_api.upcase}_WEBHOOK_URL"] = nil
    end

    let!(:api_entreprise_instructors) { create_list(:user, 2, roles: ["api_entreprise:instructor", "api_entreprise:reporter"]) }
    let!(:foreign_instructor) { create(:user, roles: ["franceconnect:instructor"]) }

    it "sends email to target api instructors, with equipe-datapass@api.gouv.fr in cc and from" do
      expect(mail.to).to contain_exactly(*api_entreprise_instructors.pluck(:email))

      expect(mail.from).to eq(["equipe-datapass@api.gouv.fr"])
      expect(mail.cc).to eq(["equipe-datapass@api.gouv.fr"])
    end

    it "renders relevant information in body and subject" do
      expect(mail.subject).to include("API Entreprise")
      expect(mail.body.encoded).to include(webhook_url)
      expect(mail.body.encoded).to include("\"lol\": \"oki\"")
      expect(mail.body.encoded).to include(webhook_response_status.to_s)
      expect(mail.body.encoded).to include(webhook_response_body)
    end
  end
end
