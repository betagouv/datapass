RSpec.describe EnrollmentsController, "#copy", type: :controller do
  describe "authorization" do
    subject(:copy_enrollment) do
      post :copy, params: {
        id: enrollment.id
      }
    end

    let(:enrollment) { create(:enrollment, :franceconnect, enrollment_status, organization_kind: :clamart, user: enrollment_creator) }
    let(:enrollment_status) { :pending }
    let(:enrollment_creator) { create(:user, organization_kind: :clamart) }

    context "without user" do
      it { is_expected.to have_http_status(:unauthorized) }
    end

    context "with a user" do
      let(:user) { create(:user, organization_kind: :clamart) }

      before do
        login(user)
      end

      context "when user created this enrollment" do
        let(:enrollment_creator) { user }

        context "when enrollment is pending" do
          let(:enrollment_status) { :pending }

          context "when user does not belong to the organization's enrollment" do
            let(:user) { create(:user, organization_kind: :dinum) }

            it { is_expected.to have_http_status(:forbidden) }
          end

          context "when user belongs to the organization's enrollment" do
            let(:user) { create(:user, organization_kind: :clamart) }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when enrollment is validated" do
          let(:enrollment_status) { :validated }

          context "when user belongs to the organization's enrollment" do
            let(:user) { create(:user, organization_kind: :clamart) }

            it { is_expected.to have_http_status(:ok) }
          end
        end
      end

      context "when user did not create this enrollment" do
        it { is_expected.to have_http_status(:forbidden) }
      end
    end
  end

  describe "with valid context and attributes" do
    subject(:copy_enrollment) do
      post :copy, params: {
        id: enrollment.id
      }
    end

    let!(:enrollment) { create(:enrollment, :franceconnect, :validated, organization_kind: :clamart, user: user) }
    let(:user) { create(:user, organization_kind: :clamart) }

    before do
      login(user)
    end

    it "creates a new enrollment associated to user" do
      expect {
        copy_enrollment
      }.to change { user.reload.enrollments.count }.by(1)
    end
  end
end
