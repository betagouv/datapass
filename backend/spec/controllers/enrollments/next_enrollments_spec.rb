RSpec.describe EnrollmentsController, "#next_enrollments", type: :controller do
  describe "authorization" do
    subject do
      get :next_enrollments, params: {
        id: enrollment.id
      }
    end

    let(:enrollment) { create(:enrollment, :franceconnect) }

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
    let(:user) { create(:user) }
    let(:enrollment) { create(:enrollment, :franceconnect, user: user) }

    before do
      login(user)
    end

    describe "enrollments present in payload" do
      subject(:enrollment_next_payload) do
        get :next_enrollments, params: {
          id: enrollment.id
        }

        JSON.parse(response.body)
      end

      context "when user created this next enrollment" do
        let!(:next_enrollment) { create(:enrollment, :franceconnect, user: user, previous_enrollment_id: enrollment.id) }

        it "has this enrollment in payload" do
          expect(enrollment_next_payload["enrollments"].count).to eq(1)

          expect(enrollment_next_payload["enrollments"].first["id"]).to eq(next_enrollment.id)
        end
      end

      context "when user is the delegue_protection_donnees associated to this next enrollment" do
        let!(:next_enrollment) { create(:enrollment, :franceconnect, delegue_protection_donnees: build(:team_member, :delegue_protection_donnees, user: user), previous_enrollment_id: enrollment.id) }

        it "has this enrollment in payload" do
          expect(enrollment_next_payload["enrollments"].count).to eq(1)

          expect(enrollment_next_payload["enrollments"].first["id"]).to eq(next_enrollment.id)
        end
      end

      context "when user is the responsable traitement associated to this next enrollment" do
        let!(:next_enrollment) { create(:enrollment, :franceconnect, responsable_traitement: build(:team_member, :responsable_traitement, user: user), previous_enrollment_id: enrollment.id) }

        it "has this enrollment in payload" do
          expect(enrollment_next_payload["enrollments"].count).to eq(1)

          expect(enrollment_next_payload["enrollments"].first["id"]).to eq(next_enrollment.id)
        end
      end

      context "when user is a reporter for the next enrollment enrollment's target api" do
        let(:user) { create(:user, roles: ["franceconnect:reporter"]) }
        let!(:next_enrollment) { create(:enrollment, :franceconnect, previous_enrollment_id: enrollment.id) }

        it "has this enrollment in payload" do
          expect(enrollment_next_payload["enrollments"].count).to eq(1)

          expect(enrollment_next_payload["enrollments"].first["id"]).to eq(next_enrollment.id)
        end
      end

      context "when user is a only reporter for another target api" do
        let(:user) { create(:user, roles: ["api_entreprise:reporter"]) }
        let!(:next_enrollment) { create(:enrollment, :franceconnect, previous_enrollment_id: enrollment.id) }

        it "does not have this enrollment in payload" do
          expect(enrollment_next_payload["enrollments"].count).to eq(0)
        end
      end
    end

    describe "payload of one next enrollment" do
      subject(:next_enrollment_payload) do
        get :next_enrollments, params: {
          id: enrollment.id
        }

        JSON.parse(response.body)["enrollments"][0]
      end

      let!(:next_enrollment) { create(:enrollment, :franceconnect, user: user, previous_enrollment_id: enrollment.id) }

      it "renders a light payload thanks to LightEnrollmentSerializer" do
        expect(next_enrollment_payload["id"]).to eq(next_enrollment.id)

        expect(next_enrollment_payload.keys).not_to include("dpo_email")
      end
    end
  end
end
