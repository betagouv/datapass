RSpec.describe EnrollmentsController, "#destroy", type: :controller do
  subject(:delete_enrollment) do
    delete :destroy, params: {
      id: enrollment.id
    }
  end

  let(:enrollment) { create(:enrollment, :franceconnect, enrollment_status, user: enrollment_creator) }
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

        context "when enrollment is validated" do
          let(:enrollment_status) { :validated }

          it { is_expected.to have_http_status(:forbidden) }
        end
      end

      context "when user is a reporter" do
        let(:user) { create(:user, roles: %w[franceconnect:reporter]) }

        it { is_expected.to have_http_status(:forbidden) }
      end

      context "when user did not create this enrollment" do
        it { is_expected.to have_http_status(:forbidden) }
      end
    end
  end
end
