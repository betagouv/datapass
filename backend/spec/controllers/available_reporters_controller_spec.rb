RSpec.describe AvailableReportersController, type: :controller do
  describe "#index" do
    subject(:get_index) { get :index, params: {target_api:} }

    let(:target_api) { :api_particulier }

    before do
      login(user)
    end

    let(:user) { create(:user, roles: [role]) }
    let!(:valid_reporters) { create_list(:reporter, 2, target_api: target_api) }

    context "when user is an instructor for this target api" do
      let(:role) { "#{target_api}:instructor" }

      it "returns a 200" do
        get_index

        expect(response.status).to eq(200)
      end

      it "returns the list of available reporters" do
        get_index

        expect(JSON.parse(response.body).map { |entity| entity["id"] }.sort).to eq(valid_reporters.pluck(:id).sort)
      end
    end

    context "when user is not an instructor for this target api" do
      let(:role) { "api_particulier:reporter" }

      it "returns a 403" do
        get_index

        expect(response.status).to eq(403)
      end
    end
  end
end
