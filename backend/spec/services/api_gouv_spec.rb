RSpec.describe ApiGouv, type: :service do
  subject { described_class.call }

  before do
    stub_api_gouv_apis_call
  end

  context "for success call to api.gouv.fr" do
    it "returns a list with datapassLink information" do
      expect(subject).to eq(
        [
          {"title" => "API Ingres - Nomenclatures",
           "tagline" => "Récupérez l'ensemble des référentiels utilisés par les Systèmes d'Information des Ressources Humaines de la Fonction Publique d'Etat",
           "path" => "/les-api/API_Ingres_Nomenclatures",
           "slug" => "API_Ingres_Nomenclatures",
           "openness" => "closed",
           "owner" => "Centre Interministériel des Systèmes d'Information relatifs aux Ressources Humaines",
           "owner_acronym" => "CISIRH",
           "logo" => "/images/api-logo/logo-cisirh.png",
           "datapass_link" => "https://datapass.api.gouv.fr/api_ingres"},
          {"title" => "API Ingres Noyau",
           "tagline" => "Récupérez l'ensemble des référentiels utilisés par les Systèmes d'Informations des Ressources Humaines de la Fonction Publique d'Etat",
           "path" => "/les-api/API_Ingres_Noyau",
           "slug" => "API_Ingres_Noyau",
           "openness" => "closed",
           "owner" => "Centre Interministériel des Systèmes d'Information relatifs aux Ressources Humaines",
           "owner_acronym" => "CISIRH",
           "logo" => "/images/api-logo/logo-cisirh.png",
           "datapass_link" => "https://datapass.api.gouv.fr/api_ingres"},
          {"title" => "API CaptchEtat",
           "tagline" => "Générer un CAPTCHA pour sécuriser un service en ligne",
           "path" => "/les-api/api-captchetat",
           "slug" => "api-captchetat",
           "openness" => "closed",
           "owner" => "Agence pour l'informatique financière de l'État",
           "owner_acronym" => "AIFE",
           "logo" => "/images/api-logo/ChorusPro.jpg",
           "datapass_link" => "https://datapass.api.gouv.fr/api-captchetat"}
        ]
      )
    end
  end

  describe "cache management" do
    let(:apis_list) { "apis_list" }
    let(:memory_store) { ActiveSupport::Cache.lookup_store(:memory_store, expires_in: 2.days) }
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
      it "stores apis_list in the cache" do
        subject
        expect(cache.exist?("apis_list")).to be(true)
      end

      it "stores apis_list in the cache for 2 days" do
        subject

        Timecop.travel(Time.now + 30.minutes) do
          expect(cache.exist?("apis_list")).to be(true)
        end

        Timecop.travel(Time.now + (1.days + 22.hours + 58.minutes)) do
          expect(cache.exist?("apis_list")).to be(true)
        end

        Timecop.travel(Time.now + (2.days + 1.minutes)) do
          expect(cache.exist?("apis_list")).to be(false)
        end
      end
    end
  end
end
