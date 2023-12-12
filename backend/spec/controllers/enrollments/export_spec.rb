require "csv"

RSpec.describe EnrollmentsLiveController, "#export", type: :controller do
  describe "authorization" do
    subject do
      get :export
    end

    context "without user" do
      it { is_expected.to have_http_status(:unauthorized) }
    end

    context "with user" do
      let(:user) { create(:user) }

      before do
        login(user)
      end

      it { is_expected.to have_http_status(:ok) }
    end
  end

  describe "payload" do
    subject do
      get :export
      response.body
    end

    let(:user) { create(:instructor, target_api: "franceconnect") }
    let!(:enrollment) { create(:enrollment, :franceconnect) }
    let!(:foreign_enrollment) { create(:enrollment, :api_entreprise) }

    before do
      login(user)
    end

    it "should return an XLSX file" do
      get :export, format: :xlsx

      expect(response).to have_http_status(:success)
      expect(response.headers["Content-Type"]).to include("application/xlsx")
    end

    it "should return an XLSX file name" do
      get :export, format: :xlsx

      expect(response.headers["Content-Disposition"]).to include("attachment; filename=\"export DataPass-#{Date.today}.xlsx")
    end
  end

  describe "payload" do
    subject do
      get :export
    end

    let(:user) { create(:instructor, target_api: "franceconnect") }
    let!(:foreign_enrollment) { create_list(:enrollment, 10, :franceconnect) }

    before do
      login(user)
    end

    it "does not make database queries" do
      pending "not find how to test it with xlsx instead of csv"

      expect { subject }.to make_database_queries(count: 3)
    end
  end
end
