RSpec.describe Enrollment::ApiParticulier, type: :model do
  let(:user) { create(:user) }
  let(:enrollment) { create(:enrollment, :api_particulier, :draft, scopes: scopes) }

  let(:scopes) {
    [
      "cnaf_quotient_familial",
      "pole_emploi_identite",
      "pole_emploi_contact"
    ]
  }

  describe "groups" do
    subject { enrollment.groups }

    context "with 3 scopes selected" do
      it "returns 2 groups" do
        expect(subject).to eq(["cnaf", "pole_emploi"])
      end
    end
  end

  describe "subscribers" do
    subject { enrollment.subscribers }

    it "does not return subscribers from other API" do
      create(:user, roles: ["fake_target_api"])
      create(:user, roles: ["franceconnect:subscriber"])
      create(:user, roles: ["franceconnect:fake_group:subscriber"])

      expect(subject.any?).to be_falsey
    end

    it "returns subscriber from this API" do
      create(:user, roles: ["franceconnect:subscriber"])
      create(:user, roles: ["api_particulier:subscriber"])
      create(:user, roles: ["api_particulier:cnaf:subscriber"])

      expect(subject.to_a.length).to eq(2)
    end

    it "does not return subscribers from non selected scopes" do
      create(:user, roles: ["api_particulier:mesri:subscriber"])

      expect(subject.any?).to be_falsey
    end

    it "does not return subscribers from unknown group" do
      create(:user, roles: ["api_particulier:unknown_group:subscriber"])

      expect(subject.any?).to be_falsey
    end
  end
end
