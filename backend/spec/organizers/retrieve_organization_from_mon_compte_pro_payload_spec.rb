RSpec.describe RetrieveOrganizationFromMonCompteProPayload, type: :organizer do
  subject(:retrieve_organization) { described_class.call(mon_compte_pro_organization_payload:) }

  let(:mon_compte_pro_organization_payload) { build(:organization_hash_from_mon_compte_pro) }

  it { is_expected.to be_a_success }

  it "creates an organization" do
    expect { retrieve_organization }.to change(Organization, :count).by(1)
  end

  it "schedules a sirene attributes refresh of the newly created organization" do
    expect {
      retrieve_organization
    }.to change { RefreshOrganizationSireneAttributesWorker.jobs.size }.by(1)

    expect(RefreshOrganizationSireneAttributesWorker.jobs.last["args"]).to eq([Organization.last.id])
  end
end
