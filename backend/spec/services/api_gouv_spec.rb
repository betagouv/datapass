RSpec.describe ApiGouv, type: :service do
  subject { described_class.call }

  before do
    stub_api_gouv_apis_call
  end

  context "for success call to api.gouv.fr" do
    it "returns 3 apis lists with datapassLink information" do
      expect(subject.size).to eq(3)
    end

    it "return the collection with info that concerns datapass only" do
      expect(subject[1]).to eq(
        {title: "le.taxi",
         slug: "le-taxi",
         tagline: "Un clic, un taxi",
         path: "/les-api/le-taxi",
         logo: "/images/api-logo/dinum.png",
         datapass_link: "/le-taxi-clients"}
      )
    end

    it "should not include list without datapass_link information" do
      expect(subject).not_to include("title" => "API Camino")
    end

    it "should add api-impot-particulier-fc-sandbox information" do
      expect(subject.last).to eq(
        {title: "API Impôt particulier via FranceConnect",
         slug: "impot-particulier",
         tagline: "Raccordez-vous directement à la DGFiP",
         path: "/les-api/impot-particulier",
         logo: "/images/api-logo/logo-dgfip.jpg",
         datapass_link: "/api-impot-particulier-fc-sandbox"}
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
