RSpec.describe ApiGouv, type: :service do
  subject { described_class.call }

  before do
    stub_api_gouv_apis_call
  end

  context "for success call to api.gouv.fr" do
    it "returns 2 apis lists with datapassLink information" do
      expect(subject.size).to eq(2)
    end

    it "return the collection with info that concerns datapass only" do
      expect(subject[1]).to match([{
        "title" => "API CaptchEtat",
        "tagline" => "Générer un CAPTCHA pour sécuriser un service en ligne",
        "path" => "/les-api/api-captchetat",
        "slug" => "api-captchetat",
        "logo" => "/images/api-logo/ChorusPro.jpg",
        "datapass_link" => "https://datapass.api.gouv.fr/api-captchetat"
      }])
    end

    it "should not include list without datapass_link information" do
      expect(subject).not_to include("title" => "API Camino")
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
