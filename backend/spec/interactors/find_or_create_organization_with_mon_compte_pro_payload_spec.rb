RSpec.describe FindOrCreateOrganizationWithMonCompteProPayload, type: :interactor do
  subject(:find_or_create_organization) { described_class.call(mon_compte_pro_organization_payload:) }

  let(:siret) { Faker::Company.french_siret_number }
  let(:mon_compte_pro_organization_payload) { build(:organization_hash_from_mon_compte_pro, siret:) }

  context "when organization already exists" do
    let!(:organization) { create(:organization, siret: siret, mon_compte_pro_payload: {old: "data"}, last_mon_compte_pro_update_at: 1.day.ago) }

    it { is_expected.to be_a_success }

    it { expect(find_or_create_organization.organization).to eq(organization) }

    it "doesn't create a new organization" do
      expect { find_or_create_organization }.not_to change(Organization, :count)
    end

    it "updates organization MonComptePro payload and last update" do
      find_or_create_organization

      expect(organization.reload.mon_compte_pro_payload).to eq(mon_compte_pro_organization_payload)
      expect(organization.reload.last_mon_compte_pro_update_at).to be_within(1.second).of(DateTime.now)
    end
  end

  context "when organization doesn't exist" do
    it { is_expected.to be_a_success }

    it { expect(find_or_create_organization.organization).to be_a(Organization) }

    it "creates a new organization with valid information" do
      expect { find_or_create_organization }.to change(Organization, :count).by(1)

      expect(find_or_create_organization.organization.siret).to eq(siret)
      expect(find_or_create_organization.organization.mon_compte_pro_payload).to eq(mon_compte_pro_organization_payload)
      expect(find_or_create_organization.organization.last_mon_compte_pro_update_at).to be_within(1.second).of(DateTime.now)
    end
  end
end
