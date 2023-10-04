RSpec.describe EnrollmentsController, "#update", type: :controller do
  subject(:update_enrollment) do
    patch :update, params: {
      id: target_enrollment.id,
      enrollment: target_enrollment_attributes
    }
  end

  let(:franceconnect_enrollment) { create(:enrollment, :franceconnect, enrollment_status, user: enrollment_creator) }
  let(:api_r2p_enrollment) { create(:enrollment, :api_r2p_unique, enrollment_status, user: enrollment_creator) }
  let(:target_enrollment) { franceconnect_enrollment }

  let(:franceconnect_attributes) do
    {
      intitule: new_intitule
    }
  end
  let(:api_r2p_attributes) do
    {
      additional_content: {
        autorite_homologation_fonction: "JHDJKZJHJKJ",
        autorite_homologation_nom: "PONEY PONEY",
        date_homologation: "2022-12-12"
      }
    }
  end

  let(:target_enrollment_attributes) { franceconnect_attributes }

  let(:new_intitule) { "Nouvel intitulé" }
  let(:enrollment_status) { :draft }
  let(:enrollment_creator) { create(:user) }

  describe "authorization" do
    context "without user" do
      it { is_expected.to have_http_status(:unauthorized) }
    end

    context "with a user" do
      let(:user) { create(:user) }

      before do
        login(user)
      end

      context "when user created this enrollment" do
        let(:enrollment_creator) { user }

        context "when enrollment is draft" do
          let(:enrollment_status) { :draft }

          it { is_expected.to have_http_status(:ok) }
        end

        context "when enrollment is validated" do
          let(:enrollment_status) { :validated }

          it { is_expected.to have_http_status(:forbidden) }
        end
      end

      context "when user did not create this enrollment" do
        it { is_expected.to have_http_status(:forbidden) }
      end
    end
  end

  describe "update" do
    let(:user) { create(:user) }
    let(:enrollment_creator) { user }
    let(:base_notifier) { instance_double("BaseNotifier", update: nil) }

    before do
      login(user)
      allow(BaseNotifier).to receive(:new).and_return(base_notifier)
    end

    context "when updating franceconnect enrollment" do
      let(:target_enrollment) { franceconnect_enrollment }
      let(:target_enrollment_attributes) { franceconnect_attributes }

      it "updates enrollment" do
        expect {
          update_enrollment
        }.to change { franceconnect_enrollment.reload.intitule }.to(new_intitule)
      end

      it "creates an event 'update' associated to this enrollment and user" do
        expect {
          update_enrollment
        }.to change { user.events.count }.by(1)

        latest_user_event = user.events.last
        latest_user_enrollment = user.enrollments.last

        expect(latest_user_event.name).to eq("update")
        expect(latest_user_event.enrollment).to eq(latest_user_enrollment)
      end

      it "calls Notifier#update" do
        update_enrollment

        expect(base_notifier).to have_received(:update)
      end
    end

    context "when updating api_r2p enrollment" do
      let(:target_enrollment) { api_r2p_enrollment }
      let(:target_enrollment_attributes) { api_r2p_attributes }

      it "updates enrollment" do
        expect {
          update_enrollment
        }.to change { api_r2p_enrollment.reload.additional_content }.to(api_r2p_attributes[:additional_content].transform_keys(&:to_s))
      end
    end
  end
end
