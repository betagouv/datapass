RSpec.describe Enrollment::ApiImpotParticulierSandbox, type: :model do
  let(:user) { create(:user) }
  let(:enrollment) { create(:enrollment, :api_impot_particulier_sandbox, :draft) }

  describe "#api_impot_particulier_scope_validation" do
    context "when no scope is selected and no specific requirement is expressed" do
      it "is not valid" do
        enrollment.send(:submit_validation)
        expect(enrollment.errors[:scopes]).to include("Vous devez cocher au moins une modalité d’accès avant de continuer")
      end
    end

    context "when no scope is selected but a specific requirement is expressed" do
      before { enrollment.update(additional_content: {"specific_requirements" => true}) }

      it "is valid" do
        enrollment.send(:submit_validation)
        expect(enrollment.errors[:scopes]).not_to include("Vous devez cocher au moins une année de revenus souhaitée avant de continuer")
      end
    end
  end
end
