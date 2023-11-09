RSpec.describe OpinionCommentsController, type: :controller do
  before do
    login(user)
  end

  describe "POST #create" do
    subject(:create_opinion_comment) do
      post :create, params: {
        enrollment_id: opinion.enrollment_id,
        opinion_id: opinion.id,
        opinion_comment: opinion_comment_attributes
      }
    end

    let(:user) { opinion.reporter }
    let(:enrollment) { create(:enrollment, :api_particulier) }
    let(:opinion) { create(:opinion, enrollment: enrollment) }
    let(:opinion_comment_attributes) { attributes_for(:opinion_comment) }

    let(:user_target_api) { :api_particulier }
    let(:opinion_attributes) { attributes_for(:opinion_comment) }

    it { is_expected.to have_http_status(:success) }

    context "when user is not the opinion's reporter" do
      let(:user) { create(:reporter, target_api: :api_particulier) }

      it { is_expected.to have_http_status(:forbidden) }
    end
  end
end
