RSpec.describe DataProviderConfigurations do
  describe "#all" do
    subject(:all_data_provider_configurations) { described_class.instance.all }

    it do
      expect {
        all_data_provider_configurations
      }.not_to raise_error
    end
  end

  describe "interpolation of ERB" do
    subject(:interpolated_value) { described_class.instance.config_for("api_particulier")["api_manager_url"] }

    it "works" do
      expect(interpolated_value).to eq("https://particulier.api.gouv.fr/compte")
    end
  end
end
