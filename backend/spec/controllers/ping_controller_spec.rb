RSpec.describe PingController, type: :controller do
  describe "GET #show" do
    it "returns a pong" do
      get :show

      expect(response.status).to eq(200)
      expect(response.body).to eq("pong")
    end
  end
end
