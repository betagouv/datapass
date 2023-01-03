RSpec.describe EnrollmentsController, "#index", type: :controller do
  describe "authorization" do
    subject do
      get :index
    end

    let!(:enrollment) { create(:enrollment, :franceconnect) }

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

  describe "coverage test" do
    subject(:enrollments_payload) do
      get :index, params: {
        target_api: "franceconnect",
        sortedBy: [{
          updated_at: :desc
        }].to_json,
        filter: [{
          key: "team_members.email",
          value: searched_user_email_filter
        }].to_json
      }

      JSON.parse(response.body)["enrollments"]
    end

    let(:user) { create(:user, roles: ["franceconnect:reporter", "api_entreprise:reporter"]) }
    let(:searched_user_email_filter) { searched_user_email.first(6) }
    let(:searched_user_email) { "searcheduser@whatever.fr" }
    let(:searched_user) { create(:user, email: searched_user_email) }

    let!(:newest_franceconnect_enrollment_from_filtered_user) { create(:enrollment, :franceconnect, user: searched_user, updated_at: 1.minute.ago) }
    let!(:oldest_franceconnect_enrollment_from_filtered_user) { create(:enrollment, :franceconnect, user: searched_user, updated_at: 1.day.ago) }

    let!(:api_entreprise_enrollment_from_filtered_user) { create(:enrollment, :api_entreprise, user: searched_user) }
    let!(:franceconnect_enrollment_from_another_user) { create(:enrollment, :franceconnect) }

    before do
      login(user)
    end

    it "renders filtered and ordered enrollments" do
      expect(enrollments_payload.count).to eq(2)

      expect(enrollments_payload.map { |enrollment_payload| enrollment_payload["id"] }).to eq([
        newest_franceconnect_enrollment_from_filtered_user.id,
        oldest_franceconnect_enrollment_from_filtered_user.id
      ])
    end
  end

  describe "only_with_unprocessed_messages params test" do
    subject(:enrollments_payload) do
      get :index, params: {
        target_api: "franceconnect",
        sortedBy: [].to_json,
        filter: [{
          key: "only_with_unprocessed_messages",
          value: true
        }].to_json
      }

      JSON.parse(response.body)["enrollments"]
    end

    let!(:user) { create(:user, roles: ["franceconnect:reporter", "franceconnect:instructor"]) }

    let!(:no_notify_event_enrollment) { create(:enrollment, :franceconnect, :draft) }
    let!(:demandeur_notify_event_enrollment) { create(:enrollment, :franceconnect, :draft) }
    let!(:demandeur_notify) do
      create(
        :event,
        name: :notify,
        enrollment_id: demandeur_notify_event_enrollment.id,
        user_id: demandeur_notify_event_enrollment.demandeurs.first.user_id,
        comment: "Demandeur comment"
      )
    end

    let!(:instructeur_notify_event_enrollment) { create(:enrollment, :franceconnect, :draft) }
    let!(:instructeur_notify) do
      create(
        :event,
        name: :notify,
        enrollment_id: instructeur_notify_event_enrollment.id,
        user_id: user.id,
        comment: "Instructor comment"
      )
    end

    before do
      login(user)
    end

    it "renders only enrollments with unprocessed messages" do
      expect(enrollments_payload.count).to eq(1)
      expect(enrollments_payload.map { |enrollment_payload| enrollment_payload["id"] }).to eq([demandeur_notify_event_enrollment.id])
    end
  end

  describe "policy" do
    subject(:enrollments_payload) do
      get :index, params: {}

      JSON.parse(response.body)["enrollments"]
    end

    subject do
      get :index
    end

    before do
      login(user)
    end

    let!(:enrollment) { create(:enrollment, :api_particulier) }

    context "with a user with no roles" do
      let(:user) { create(:user, roles: []) }

      it "renders filtered and ordered enrollments" do
        expect(enrollments_payload.count).to eq(0)
      end
    end

    context "with an instructor of another api" do
      let(:user) { create(:user, roles: ["api_entreprise:reporter"]) }

      it "renders filtered and ordered enrollments" do
        expect(enrollments_payload.count).to eq(0)
      end
    end

    context "with an instructor of this api" do
      let(:user) { create(:user, roles: ["api_particulier:reporter"]) }

      it "renders filtered and ordered enrollments" do
        expect(enrollments_payload.count).to eq(1)
      end
    end

    context "with an instructor within a concerned group" do
      let(:user) { create(:user, roles: ["api_particulier:cnaf:reporter"]) }

      it "renders filtered and ordered enrollments" do
        expect(enrollments_payload.count).to eq(1)
      end
    end

    context "with an instructor within a non-concerned group" do
      let(:user) { create(:user, roles: ["api_particulier:pole_emploi:reporter"]) }

      it "renders filtered and ordered enrollments" do
        expect(enrollments_payload.count).to eq(0)
      end
    end

    context "with an instructor within non-concerned and concerned groups" do
      let(:user) {
        create(:user, roles: [
          "api_particulier:cnaf:reporter",
          "api_particulier:pole_emploi:reporter"
        ])
      }

      it "renders filtered and ordered enrollments" do
        expect(enrollments_payload.count).to eq(1)
      end
    end

    context "with an instructor within non-concerned group and all groups" do
      let(:user) {
        create(:user, roles: [
          "api_particulier:reporter",
          "api_particulier:pole_emploi:reporter"
        ])
      }

      it "renders filtered and ordered enrollments" do
        expect(enrollments_payload.count).to eq(1)
      end
    end
  end
end
