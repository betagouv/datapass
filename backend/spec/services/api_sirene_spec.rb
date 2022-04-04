RSpec.describe ApiSirene, type: :service do
  subject { described_class.new(siret).call }

  before do
    stub_entreprise_data_etablissement_call(siret)
  end

  context "for an administration" do
    let(:siret) { "21920023500014" }

    it "return organization info" do
      expect(subject).to eq({
        nom_raison_sociale: "COMMUNE DE CLAMART",
        siret: "21920023500014",
        denomination: "COMMUNE DE CLAMART",
        sigle: nil,
        adresse: "1 PL MAURICE GUNSBOURG",
        code_postal: "92140",
        code_commune: "92023",
        libelle_commune: "CLAMART",
        activite_principale: "84.11Z",
        activite_principale_label: "Administration publique générale",
        categorie_juridique: "7210",
        categorie_juridique_label: "Commune et commune nouvelle",
        etat_administratif: "A"
      })
    end
  end
  context "for an individual organization" do
    let(:siret) { "88301031600015" }

    it "return given name and family name as nom_raison_sociale" do
      expect(subject[:nom_raison_sociale]).to eq("PAUL JACQUES JEAN PIERRE")
    end
  end
end
