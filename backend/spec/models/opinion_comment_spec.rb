RSpec.describe OpinionComment, type: :model do
  it "has valid factories" do
    expect(build(:opinion_comment)).to be_valid
  end

  describe "user validation" do
    subject { build(:opinion_comment, target_api: :api_particulier, opinion:, user:) }

    let(:opinion) { create(:opinion) }

    context "when user is not the opinion's reporter" do
      let(:user) { create(:user, roles: ["api_entreprise:reporter"]) }

      it { is_expected.not_to be_valid }
    end

    context "when user is the opinion's reporter" do
      let(:user) { opinion.reporter }

      it { is_expected.to be_valid }
    end
  end
end
