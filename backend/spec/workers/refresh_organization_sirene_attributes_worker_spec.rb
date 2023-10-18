require "rails_helper"

RSpec.describe RefreshOrganizationSireneAttributesWorker, type: :worker do
  subject(:refresh_organization) { described_class.perform_async(organization_id) }

  context "when organization_id is invalid " do
    let(:organization_id) { -1 }

    it "does not raise an error" do
      expect { subject }.not_to raise_error
    end
  end

  context "when organization_id is valid" do
    let(:organization_id) { organization.id }
    let(:organization) { create(:organization, insee_payload: {old: "data"}, last_insee_update_at: 1.day.ago) }

    before do
      Timecop.freeze

      allow(ApiSirene).to receive(:call).and_return(sirene_service_payload)
    end

    after do
      Timecop.return
    end

    context "when API Sirene works" do
      let(:sirene_service_payload) { build(:sirene_service_payload, siret: organization.siret) }

      it "updates organization insee_payload and last_insee_update" do
        refresh_organization

        expect(organization.reload.insee_payload).to eq(sirene_service_payload.stringify_keys)
        expect(organization.reload.last_insee_update_at).to be_within(1.second).of(Time.zone.now)
      end
    end
  end
end
