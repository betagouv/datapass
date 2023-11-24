RSpec.describe ReopenEnrollmentsController, type: :controller do
  describe "#update" do
    subject(:update) { put :update, params: {id: enrollment.id} }

    let(:enrollment) do
      create(
        :enrollment,
        enrollment_status,
        :api_particulier,
        organization_kind: :clamart
      )
    end
    let(:enrollment_status) { :validated }
    let(:user) { enrollment.demandeurs.first.user }

    describe "authorization" do
      context "without user" do
        it { is_expected.to have_http_status(:unauthorized) }
      end

      context "with user" do
        before do
          login(user)
        end

        context "when user is the enrollment's creator" do
          context "when enrollment is in validated" do
            it { is_expected.to have_http_status(:ok) }
          end

          context "when enrollment is in draft mode" do
            let(:enrollment_status) { :draft }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is not the enrollment's creator" do
          let(:user) { create(:user, email_verified: true, organization_kind: :clamart) }

          it { is_expected.to have_http_status(:forbidden) }
        end
      end
    end

    describe "behavior" do
      before do
        login(user)
      end

      it { is_expected.to have_http_status(:ok) }

      it "reopens the enrollment" do
        expect {
          update
        }.to change { enrollment.reload.status }.to("draft")
      end
    end
  end
end
