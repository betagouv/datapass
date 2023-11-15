RSpec.describe Enrollment::ApiEntreprise, type: :model do
  describe "#scopes sanitization" do
    subject(:save_enrollment) { enrollment.save }

    context "when scopes have open_data scopes" do
      let(:enrollment) { build(:enrollment, :api_entreprise, scopes: %w[unites_legales_etablissements_insee open_data open_data_whatever]) }

      it "cleans open_data_ scopes" do
        expect {
          save_enrollment
          enrollment.reload
        }.to change { enrollment.scopes }.to(%w[unites_legales_etablissements_insee open_data])
      end
    end
  end
end
