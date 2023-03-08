RSpec.describe ApiGouv, type: :service do
  subject { described_class.call }

  setup do
    VCR.insert_cassette("api_gouv_payload")
  end

  teardown do
    VCR.eject_cassette
  end

  context "for success call to api.gouv.fr" do
    it "return the collection with info that concerns datapass only", :vcr do
      expect(subject).to include(
        {logo: "/images/api-logo/dinum.png",
         pass_path: "/le-taxi",
         path: "/les-api/le-taxi",
         slug: "le-taxi",
         tagline: "Un clic, un taxi",
         title: "le.taxi"}
      )
    end

    it "should not include list without pass_path information", :vcr do
      expect(subject).not_to include({title: "API Camino"})
    end

    it "should add api-impot-particulier-fc-sandbox information", :vcr do
      expect(subject.last).to eq(
        {title: "API Impôt particulier via FranceConnect",
         slug: "impot-particulier-fc",
         tagline: "Raccordez-vous directement à la DGFiP pour récupérer les éléments fiscaux nécessaires à vos téléservices, éliminez le traitement et le stockage des pièces justificatives",
         path: "/les-api/impot-particulier",
         logo: "/images/api-logo/logo-dgfip.jpg",
         pass_path: "/api-impot-particulier-fc-sandbox"}
      )
    end
  end

  describe "cache management" do
    let(:apis) { "apis" }
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
      it "stores apis in the cache" do
        subject
        expect(cache.exist?("apis")).to be(true)
      end

      it "stores apis in the cache for 2 days" do
        subject

        Timecop.travel(Time.now + 30.minutes) do
          expect(cache.exist?("apis")).to be(true)
        end

        Timecop.travel(Time.now + (1.days + 22.hours + 58.minutes)) do
          expect(cache.exist?("apis")).to be(true)
        end

        Timecop.travel(Time.now + (2.days + 1.minutes)) do
          expect(cache.exist?("apis")).to be(false)
        end
      end
    end
  end
end
