RSpec.describe InseeController, type: :controller do
  describe "#code_naf" do
    subject(:get_codes_naf) do
      get :codes_naf, params: {
        id: code_naf
      }
    end

    context "with valid naf code" do
      let(:code_naf) { "62.02A" }

      it { is_expected.to have_http_status(:ok) }

      it do
        expect(JSON.parse(get_codes_naf.body)).to eq({
          "message" => "Conseil en systèmes et logiciels informatiques"
        })
      end
    end

    context "with invalid naf code" do
      let(:code_naf) { "62.02C" }

      it { is_expected.to have_http_status(:not_found) }
    end
  end

  describe "#categorie_juridique" do
    subject(:get_categories_juridiques) do
      get :categories_juridiques, params: {
        id: categorie_juridique
      }
    end

    context "with valid categorie juridique" do
      let(:categorie_juridique) { "5710" }

      it { is_expected.to have_http_status(:ok) }

      it do
        expect(JSON.parse(get_categories_juridiques.body)).to eq({
          "message" => "SAS, société par actions simplifiée"
        })
      end
    end

    context "with invalid categorie juridique" do
      let(:categorie_juridique) { "6110" }

      it { is_expected.to have_http_status(:not_found) }
    end
  end
end
