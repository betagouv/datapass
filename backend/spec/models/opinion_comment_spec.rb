RSpec.describe OpinionComment, type: :model do
  it "has valid factories" do
    expect(build(:opinion_comment)).to be_valid
  end

  describe "user roles" do
    subject { build(:opinion_comment, target_api: :api_particulier, user:) }

    context "when user is not a reporter or instructor" do
      let(:user) { create(:user, roles: ["api_entreprise:admin"]) }

      it { is_expected.not_to be_valid }
    end

    context "when user is a reporter" do
      let(:user) { create(:user, roles: ["api_particulier:reporter"]) }

      it { is_expected.to be_valid }
    end

    context "when user is an instructor" do
      let(:user) { create(:user, roles: ["api_particulier:instructor"]) }

      it { is_expected.to be_valid }
    end
  end
end
