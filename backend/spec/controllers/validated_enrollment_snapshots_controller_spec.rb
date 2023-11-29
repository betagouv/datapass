RSpec.describe ValidatedEnrollmentSnapshotsController, type: :controller, versioning: true do
  describe "authorization" do
    subject do
      get :show, params: {
        enrollment_id: enrollment.id,
        id: snapshot.id
      }
    end

    let(:snapshot) { enrollment.last_snapshot }
    let(:enrollment) do
      original_enrollment.snapshot!
      original_enrollment
    end

    context "without user" do
      let(:original_enrollment) { create(:enrollment, :franceconnect) }

      it { is_expected.to have_http_status(:unauthorized) }
    end

    context "with user" do
      let(:user) { create(:user) }

      before do
        login(user)
      end

      context "when user created this enrollment" do
        let(:original_enrollment) { create(:enrollment, :franceconnect, user: user) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is the delegue_protection_donnees associated to this enrollment" do
        let(:original_enrollment) { create(:enrollment, :franceconnect, delegue_protection_donnees: build(:team_member, :delegue_protection_donnees, user: user)) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is the responsable traitement associated to this enrollment" do
        let(:original_enrollment) { create(:enrollment, :franceconnect, responsable_traitement: build(:team_member, :responsable_traitement, user: user)) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is a reporter for the enrollment target api" do
        let(:user) { create(:user, roles: ["api_particulier:reporter"]) }
        let(:original_enrollment) { create(:enrollment, :api_particulier) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is a reporter for the enrollment group" do
        let(:user) { create(:user, roles: ["api_particulier:cnaf:reporter"]) }
        let(:original_enrollment) { create(:enrollment, :api_particulier) }

        it { is_expected.to have_http_status(:ok) }
      end

      context "when user is a only reporter for another group" do
        let(:user) { create(:user, roles: ["api_entreprise:pole_emploi:reporter"]) }
        let(:original_enrollment) { create(:enrollment, :api_particulier) }

        it { is_expected.to have_http_status(:forbidden) }
      end

      context "when user is a only reporter for another target api" do
        let(:user) { create(:user, roles: ["api_entreprise:reporter"]) }
        let(:original_enrollment) { create(:enrollment, :api_particulier) }

        it { is_expected.to have_http_status(:forbidden) }
      end
    end
  end

  describe "payload" do
    subject(:show_enrollment_payload) do
      get :show, params: {
        enrollment_id: enrollment.id,
        id: snapshot.id
      }

      JSON.parse(response.body)
    end

    let(:enrollment) do
      original_enrollment.snapshot!
      original_enrollment.update!(intitule: "new intitule")
      original_enrollment.team_members.first.update!(given_name: "new given name")
      original_enrollment
    end

    let(:snapshot) { enrollment.last_snapshot }
    let(:original_enrollment) { create(:enrollment, :franceconnect, user: user) }
    let(:user) { create(:user) }

    before do
      login(user)
    end

    it "renders the snapshot version" do
      expect(show_enrollment_payload["intitule"]).not_to eq("new intitule")
      expect(show_enrollment_payload["team_members"][0]["given_name"]).not_to eq("new given name")
    end
  end
end
