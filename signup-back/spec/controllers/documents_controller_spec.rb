RSpec.describe DocumentsController, type: :controller do
  describe "#show" do
    subject(:show_document) do
      get :show, params: {
        id: document.id,
        model: "whatever",
        type: "whatever",
        mounted_as: "whatever",
        filename: "whatever"
      }
    end

    let(:document) { create(:document, attachable: enrollment) }
    let(:enrollment) { create(:enrollment, :franceconnect, user: enrollment_creator) }
    let(:enrollment_creator) { create(:user) }

    context "without user" do
      it { is_expected.to have_http_status(:unauthorized) }
    end

    context "with a user" do
      let(:user) { create(:user, roles: roles) }
      let(:roles) { [] }

      before do
        login(user)
      end

      context "when user is the enrollment's creator" do
        let(:enrollment_creator) { user }

        it { is_expected.to have_http_status(:ok) }

        it "renders the document" do
          show_document

          expect(response.body).to eq(document.attachment.read)
        end
      end

      context "when user is not the enrollment's creator" do
        context "when user is a reporter for the enrollment target api" do
          let(:roles) { ["franceconnect:reporter"] }

          it { is_expected.to have_http_status(:ok) }
        end

        context "when user is a reporter for another target api" do
          let(:roles) { ["api_entreprise:reporter"] }

          it { is_expected.to have_http_status(:forbidden) }
        end
      end
    end
  end
end
