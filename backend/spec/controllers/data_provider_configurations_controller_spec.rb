RSpec.describe DataProviderConfigurationsController, type: :controller do
  describe "#index" do
    subject(:get_data_provider_configurations) do
      get :index
      response
    end

    let(:user) { create(:user) }

    context "with an unauthenticated user" do
      it { expect(get_data_provider_configurations).to have_http_status(:ok) }
    end

    context "with an authenticated user" do
      before do
        login(user)
      end

      it { expect(get_data_provider_configurations).to have_http_status(:ok) }

      it "should return an array with more than 1 element" do
        expect(
          JSON.parse(get_data_provider_configurations.body)["configurations"].length
        ).to be >= 1
      end
    end
  end

  describe "#show" do
    subject(:get_data_provider_configuration) do
      get :show, params: {target_api: target_api}
      response
    end

    let(:target_api) { "api_particulier" }
    let(:user) { create(:user) }

    context "with an unauthenticated user" do
      it { expect(get_data_provider_configuration).to have_http_status(:unauthorized) }
    end

    context "with an authenticated user" do
      before do
        login(user)
      end

      it { expect(get_data_provider_configuration).to have_http_status(:ok) }

      context "with form not configured from the backend" do
        let(:target_api) { "franceconnect" }

        it { expect(get_data_provider_configuration).to have_http_status(:not_found) }
      end

      context "when target api is unknown" do
        let(:target_api) { "unknown_target_api" }

        it { expect(get_data_provider_configuration).to have_http_status(:not_found) }
      end
    end
  end
end
