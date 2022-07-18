RSpec.describe ApiSirene, type: :service do
  subject { described_class.new(siret).call }

  before do
    stub_api_insee_etablissement_call(siret)
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

  context "for a closed individual organization" do
    let(:siret) { "83951732300011" }

    it "return siret and etat_administratif" do
      expect(subject).to eq({
        nom_raison_sociale: nil,
        siret: "83951732300011",
        denomination: nil,
        sigle: nil,
        adresse: nil,
        code_postal: nil,
        code_commune: nil,
        libelle_commune: nil,
        activite_principale: nil,
        activite_principale_label: nil,
        categorie_juridique: nil,
        categorie_juridique_label: nil,
        etat_administratif: "F"
      })
    end
  end

  context "for a non diffusable organization" do
    let(:siret) { "30002490800026" }

    it "return nil" do
      expect(subject).to eq(nil)
    end
  end

  context "for an organization not present in INSEE database (ex: gendarmerie)" do
    let(:siret) { "15700033200013" }

    it "return nil" do
      expect(subject).to eq(nil)
    end
  end

  context "for an over quota query" do
    let(:siret) { "12345678901234" }

    it "raise error ApplicationController::BadGateway" do
      expect { subject }.to raise_error(ApplicationController::BadGateway)
    end
  end

  context "for an unknown siret" do
    let(:siret) { "88888888800011" }

    it "return nil" do
      expect(subject).to eq(nil)
    end
  end

  describe "cache management" do
    let(:siret) { "21920023500014" }
    # Api Insee Token expires in 514532 seconds, about 5 days and 22 hours and 55 minutes
    let(:memory_store) { ActiveSupport::Cache.lookup_store(:memory_store, expires_in: 514532) }
    let(:cache) { Rails.cache }

    before do
      Timecop.freeze(Time.now)
      allow(Rails).to receive(:cache).and_return(memory_store)
      Rails.cache.clear
    end

    after do
      Timecop.return
    end

    context "when service is called once" do
      it "stores access_token in the cache" do
        expect(cache.exist?("insee/access_token")).to be(false)
        subject
        expect(cache.exist?("insee/access_token")).to be(true)
      end

      it "stores access_token in the cache for 5 days and 22hours and 54 min" do
        subject

        Timecop.travel(Time.now + 3.days) do
          expect(cache.exist?("insee/access_token")).to be(true)
        end

        Timecop.travel(Time.now + (5.days + 22.hours + 54.minutes)) do
          expect(cache.exist?("insee/access_token")).to be(true)
        end

        Timecop.travel(Time.now + (5.days + 22.hours + 56.minutes)) do
          expect(cache.exist?("insee/access_token")).to be(false)
        end
      end
    end

    context "when service is called twice" do
      subject { 2.times { described_class.new(siret).call } }

      it "subject is called twice but insee_host/token is called once" do
        subject

        expect(a_request(:post, "#{ENV.fetch("INSEE_HOST")}/token"))
          .to have_been_made.once
      end
    end
  end
end
