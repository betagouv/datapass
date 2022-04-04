describe ValidateRequestParams do
  include Rack::Test::Methods

  let(:app) { DataPass::Application }

  context "WITH invalid characters" do
    let(:null_byte) { "\u0000" }

    it "responds with 400 BadRequest for strings" do
      post "/api/users", name: "I am #{null_byte} bad"

      expect(last_response.bad_request?).to eq true
    end
  end

  context "WITHOUT invalid characters" do
    it "responds with a 401 for strings" do
      post "/api/users", name: "safe name"

      expect(last_response.unauthorized?).to eq true
    end

    it "responds with a 401 with no params" do
      post "/api/users"

      expect(last_response.unauthorized?).to eq true
    end
  end
end
