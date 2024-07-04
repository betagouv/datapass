RSpec.describe Api::FrontalController, type: :controller do
  describe "GET #index" do
    subject { get :index }

    after do
      ENV["FRONTAL"] = "false"
    end

    context "when it is frontal" do
      before do
        ENV["FRONTAL"] = "true"
      end

      it { is_expected.to have_http_status(:ok) }
    end

    context "when it is not frontal" do
      before do
        ENV["FRONTAL"] = "false"
      end

      it { is_expected.to have_http_status(418) }
    end
  end
end
