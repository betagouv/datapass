RSpec.describe EnrollmentsController, "#update", type: :controller do
  subject(:update_enrollment) do
    patch :update, params: {
      id: enrollment.id,
      enrollment: enrollment_attributes
    }
  end

  let(:enrollment) { create(:enrollment, :franceconnect, enrollment_status, user: enrollment_creator) }
  let(:enrollment_attributes) do
    {
      intitule: new_intitule
    }
  end
  let(:new_intitule) { "Nouvel intitulé" }
  let(:enrollment_status) { :pending }
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

        context "when enrollment is pending" do
          let(:enrollment_status) { :pending }

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

    before do
      login(user)
    end

    it "updates enrollment" do
      expect {
        update_enrollment
      }.to change { enrollment.reload.intitule }.to(new_intitule)
    end

    it "creates an event 'updated' associated to this enrollment and user" do
      expect {
        update_enrollment
      }.to change { user.events.count }.by(1)

      latest_user_event = user.events.last
      latest_user_enrollment = user.enrollments.last

      expect(latest_user_event.name).to eq("updated")
      expect(latest_user_event.enrollment).to eq(latest_user_enrollment)
    end
  end
end
