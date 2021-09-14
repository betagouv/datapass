RSpec.describe Users::SessionsController, type: :controller do
  describe "#api_gouv" do
    subject do
      get :api_gouv
    end

    before do
      @request.env["devise.mapping"] = Devise.mappings[:user]
      OmniAuth.config.test_mode = true

      OmniAuth.config.mock_auth[:api_gouv] = OmniAuth::AuthHash.new({
        credentials: {
          id_token: "id_token",
          token: "token"
        },
        info: {
          "email" => generate(:email),
          "sub" => "1234567890",
          "given_name" => "Jean"
        }
      })
      request.env["omniauth.auth"] = OmniAuth.config.mock_auth[:api_gouv]
    end

    after do
      OmniAuth.config.mock_auth[:api_gouv] = nil
      OmniAuth.config.test_mode = false
    end

    it { is_expected.to have_http_status(:found) }

    it "creates a new user" do
      expect {
        subject
      }.to change(User, :count).by(1)
    end
  end
end
