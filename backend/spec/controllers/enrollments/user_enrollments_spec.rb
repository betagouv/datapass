RSpec.describe EnrollmentsController, "#user", type: :controller do
  subject(:user_enrollments) do
    get :user
  end

  context "with an unauthenticated user" do
    it { is_expected.to have_http_status(:unauthorized) }
  end

  context "with an authenticated user" do
    let(:user) { create(:user) }

    before do
      login(user)
    end

    it { is_expected.to have_http_status(:ok) }

    describe "response payload order" do
    end

    describe "response payload" do
      subject(:user_enrollment_ids_payload) do
        get :user

        JSON.parse(response.body).map do |enrollment_payload|
          enrollment_payload["id"]
        end
      end

      context "when user has created an enrollment" do
        let!(:enrollment_created_by_user) { create(:enrollment, :franceconnect, user: user) }

        it "includes it in the response" do
          expect(user_enrollment_ids_payload).to include(enrollment_created_by_user.id)
        end
      end

      context "when user is the delegue_protection_donnees associated to an enrollment" do
        let!(:enrollment_where_user_is_the_dpo) { create(:enrollment, :franceconnect, delegue_protection_donnees: build(:team_member, :delegue_protection_donnees, user: user)) }

        it "includes it in the response" do
          expect(user_enrollment_ids_payload).to include(enrollment_where_user_is_the_dpo.id)
        end
      end

      context "when user is the responsable traitement associated to an enrollment" do
        let!(:enrollment_where_user_is_the_responsable_traitement) { create(:enrollment, :franceconnect, responsable_traitement: build(:team_member, :responsable_traitement, user: user)) }

        it "includes it in the response" do
          expect(user_enrollment_ids_payload).to include(enrollment_where_user_is_the_responsable_traitement.id)
        end
      end

      context "when user is a reporter for some target api" do
        let(:user) { create(:user, roles: ["franceconnect:reporter", "aidants_connect:reporter"]) }

        let!(:franceconnect_enrollment) { create(:enrollment, :franceconnect) }
        let!(:aidants_connect_enrollment) { create(:enrollment, :aidants_connect) }
        let!(:api_particulier_enrollment) { create(:enrollment, :api_particulier) }

        it "includes enrollments associated to these target api only" do
          expect(user_enrollment_ids_payload).to include(franceconnect_enrollment.id)
          expect(user_enrollment_ids_payload).to include(aidants_connect_enrollment.id)

          expect(user_enrollment_ids_payload).not_to include(api_particulier_enrollment.id)
        end
      end
    end
  end
end
