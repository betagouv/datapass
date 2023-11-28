RSpec.describe Organization, type: :model do
  it "has valid factories" do
    expect(build(:organization)).to be_valid
  end

  describe ".find_by_mon_compte_pro_id" do
    let(:mon_compte_pro_id) { rand(100..9001) }
    let!(:organization) { create(:organization, mon_compte_pro_payload: build(:organization_hash_from_mon_compte_pro, id: mon_compte_pro_id)) }

    it "returns the organization with the given mon_compte_pro_id" do
      expect(Organization.find_by_mon_compte_pro_id(mon_compte_pro_id)).to eq(organization)
    end

    it "returns nil when no organization has the given mon_compte_pro_id" do
      expect(Organization.find_by_mon_compte_pro_id(mon_compte_pro_id + 9001)).to be_nil
    end
  end
end
