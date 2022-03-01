RSpec.describe EnrollmentsHubeeValidatedController, type: :controller do
  describe "http status" do
    subject(:get_enrollments_hubee_validated) do
      get :index
      response
    end

    let!(:some_enrollments) do
      create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart)
      create(:enrollment, :hubee_portail_dila, :validated, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :validated, organization_kind: :dinum)
    end

    let(:user) { create(:user, organization_kind: :clamart) }
    let(:body) { JSON.parse(get_enrollments_hubee_validated.body)["enrollments"] }

    context "without user" do
      it { is_expected.to have_http_status(:unauthorized) }
    end

    context "with a region_reunion user" do
      let(:user) { create(:user, organization_kind: :region_reunion) }

      before do
        login(user)
      end

      it { is_expected.to have_http_status(:ok) }

      it "should return empty array" do
        expect(body).to be_empty
      end
    end

    context "with a clamart user" do
      before do
        login(user)
      end

      it { is_expected.to have_http_status(:ok) }

      it "should return not empty array" do
        expect(body).to_not be_empty
      end

      it "should return only hubee enrollment" do
        create(:enrollment, :franceconnect, :validated, organization_kind: :clamart)

        expect(body).to all(
          include("target_api" => "hubee_portail")
            .or(include("target_api" => "hubee_portail_dila"))
        )
      end

      it "should return only validated enrollment" do
        create(:enrollment, :hubee_portail, :draft, organization_kind: :clamart)

        expect(body).to all(include("status" => "validated"))
      end
    end
  end
end
