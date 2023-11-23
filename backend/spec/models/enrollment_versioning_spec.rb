RSpec.describe Enrollment, "versionning", type: :model do
  describe "reify to one previous version" do
    subject(:reify) { enrollment.last_snapshot.fetch_reified_items }

    let(:enrollment) do
      enrollment = create(:enrollment, :api_particulier, :submitted)

      enrollment.snapshot!

      enrollment.update!(intitule: "new intitule")
      enrollment.team_members.first.update!(given_name: "new demandeur given name")

      enrollment
    end

    it "reverts to the previous version the model and associations" do
      expect(reify[0].intitule).not_to eq("new intitule")
      expect(reify[1]["team_members"].first.given_name).not_to eq("new demandeur given name")
    end
  end
end
