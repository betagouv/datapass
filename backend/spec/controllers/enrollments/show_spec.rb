RSpec.describe EnrollmentsController, "#show", type: :controller do
  describe "authorization" do
    subject do
      get :show, params: {
        id: enrollment.id
      }
    end

    context "without user" do
      let(:enrollment) { create(:enrollment, :franceconnect) }

      it { is_expected.to have_http_status(:unauthorized) }
    end

    context "with user" do
      let(:user) { create(:user) }

      before do
        login(user)
      end

      context "when user created this enrollment" do
        let(:enrollment) { create(:enrollment, :franceconnect, user: user) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is the delegue_protection_donnees associated to this enrollment" do
        let(:enrollment) { create(:enrollment, :franceconnect, delegue_protection_donnees: build(:team_member, :delegue_protection_donnees, user: user)) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is the responsable traitement associated to this enrollment" do
        let(:enrollment) { create(:enrollment, :franceconnect, responsable_traitement: build(:team_member, :responsable_traitement, user: user)) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is a reporter for the enrollment target api" do
        let(:user) { create(:user, roles: ["api_particulier:reporter"]) }
        let(:enrollment) { create(:enrollment, :api_particulier) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is a reporter for the enrollment group" do
        let(:user) { create(:user, roles: ["api_particulier:cnaf:reporter"]) }
        let(:enrollment) { create(:enrollment, :api_particulier) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is a only reporter for another group" do
        let(:user) { create(:user, roles: ["api_entreprise:pole_emploi:reporter"]) }
        let(:enrollment) { create(:enrollment, :api_particulier) }

        it { is_expected.to have_http_status(:forbidden) }
      end

      context "when user is a only reporter for another target api" do
        let(:user) { create(:user, roles: ["api_entreprise:reporter"]) }
        let(:enrollment) { create(:enrollment, :api_particulier) }

        it { is_expected.to have_http_status(:forbidden) }
      end
    end
  end

  describe "payload" do
    subject(:show_enrollment_payload) do
      get :show, params: {
        id: enrollment.id
      }

      JSON.parse(response.body)
    end

    let(:user) { create(:user) }
    let(:enrollment) { create(:enrollment, :franceconnect, user: user, type_projet: "whatever") }

    before do
      login(user)
    end

    it "includes fields defined in EnrollmentSerializer only" do
      expect(show_enrollment_payload["type_projet"]).to eq(enrollment.type_projet)
    end
  end
end
