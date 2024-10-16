# frozen_string_literal: true

RSpec.describe Enrollment::ApiImpotParticulierSandbox, type: :model do
  let(:user) { create(:user) }
  let(:enrollment) { create(:enrollment, :api_impot_particulier_sandbox, :draft, scopes: []) }

  describe "#api_impot_particulier_scope_validation" do
    context "when no scope is selected and no specific requirement is expressed" do
      it "is not valid" do
        enrollment.send(:submit_validation)
        expect(enrollment.errors[:scopes]).to include("Vous devez cocher au moins une année de revenus souhaitée avant de continuer")
      end
    end

    context "when incompatible years combination years are selected" do
      before { enrollment.update(scopes: ["dgfip_annee_n_moins_2_si_indispo_n_moins_1", "dgfip_annee_n_moins_1"]) }

      it 'is not valid' do
        enrollment.send(:submit_validation)
        expect(enrollment.errors[:scopes]).to include("Vous ne pouvez pas sélectionner la donnée 'avant dernière année de revenu, si la dernière année de revenu est indisponible' avec d'autres années de revenus")
      end
    end

    context "when exclusive years combination years are selected" do
      before { enrollment.update(scopes: ["dgfip_annee_n_moins_1", "dgfip_annee_n_moins_2"]) }

      it 'is valid' do
        enrollment.send(:submit_validation)
        expect(enrollment).to be_valid
      end
    end

    context "when no scope is selected but a specific requirement is expressed" do
      before { enrollment.update(additional_content: {"specific_requirements" => true}) }

      it "is valid" do
        enrollment.send(:submit_validation)
        expect(enrollment.errors[:scopes]).not_to include("Vous devez cocher au moins une année de revenus souhaitée avant de continuer")
      end
    end

    context "when incompatible scopes are selected with special scopes" do
      before { enrollment.update(scopes: ["dgfip_IndLep", "dgfip_annee_df_au_3112_si_deces_ctb_mp"]) }

      it "is not valid" do
        enrollment.send(:submit_validation)
        expect(enrollment.errors[:scopes]).to include("Des données incompatibles entre elles ont été cochées. Pour connaître les modalités d’appel et de réponse de l’API Impôt particulier ainsi que les données proposées, vous pouvez consulter le guide de présentation de cette API dans la rubrique « Les données nécessaires > Comment choisir les données »")
      end
    end
  end
end
