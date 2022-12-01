require "csv"

RSpec.describe EnrollmentsExportController, "#export", type: :controller do
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

    it "is a valid csv, only on target apis" do
      csv = CSV.parse(subject, headers: true)

      expect(csv.count).to eq(1)

      first_entry = csv.first

      expect(first_entry["id"]).to eq(enrollment.id.to_s)
      expect(first_entry["target_api"]).to eq("franceconnect")
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
      expect { subject }.to make_database_queries(count: 3)
    end
  end
end
