RSpec.describe EnrollmentsLiveController, "#export", type: :controller do
  describe "authorization" do
    subject do
      get :export
    end

    context "without user" do
      it { is_expected.to have_http_status(:unauthorized) }
    end

    context "with user" do
      let(:user) { create(:instructor, target_api: "franceconnect") }
      let!(:enrollment) { create(:enrollment, :franceconnect) }

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

    context "when xlsx files contains enrollments"  do
      it "should return an XLSX file" do
        get :export, format: :xlsx

        expect(response).to have_http_status(:success)
        expect(response.headers["Content-Type"]).to include("application/xlsx")
      end

      it "should return an XLSX file name" do
        get :export, format: :xlsx

        expect(response.headers["Content-Disposition"]).to include("attachment; filename=\"export-datapass-#{Date.today}.xlsx")
      end
    end

    context "when xlsx files is empty" do
      let(:enrollment) { nil }

      it "should return a not found error" do
        get :export, format: :xlsx

        expect(response).to have_http_status(:not_found)
      end

    end

  end
end
