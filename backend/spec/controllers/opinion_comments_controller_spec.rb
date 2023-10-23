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

    let(:user) { create(:reporter, target_api: user_target_api) }
    let(:enrollment) { create(:enrollment, :api_particulier) }
    let(:opinion) { create(:opinion, enrollment: enrollment) }
    let(:opinion_comment_attributes) { attributes_for(:opinion_comment) }

    let(:user_target_api) { :api_particulier }
    let(:opinion_attributes) { attributes_for(:opinion_comment) }

    context "when user is a reporter for the target api" do
      let(:user_target_api) { :api_particulier }

      it { is_expected.to have_http_status(:created) }
    end

    context "when user is not a reporter for the target api" do
      let(:user_target_api) { :api_entreprise }

      it { is_expected.to have_http_status(:forbidden) }
    end
  end
end
