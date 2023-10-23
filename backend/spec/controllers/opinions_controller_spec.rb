RSpec.describe OpinionsController, type: :controller do
  let(:user) { create(:user) }

  before do
    login(user)
  end

  describe "POST #create" do
    subject(:create_opinion) do
      post :create, params: {
        enrollment_id: enrollment.id,
        opinion: opinion_attributes
      }
    end

    let(:reporter) { create(:reporter, target_api: reporter_target_api) }
    let(:enrollment) { create(:enrollment, :api_particulier) }

    let(:reporter_target_api) { :api_particulier }
    let(:opinion_attributes) { attributes_for(:opinion).merge(reporter_id: reporter.id) }

    context "when user is an instructor for the target api" do
      let(:user) { create(:instructor, target_api: :api_particulier) }

      it { is_expected.to have_http_status(:created) }

      context "when reporter is not a reporter for the target api" do
        let(:reporter_target_api) { :api_droits_cnam }

        it { is_expected.to have_http_status(:unprocessable_entity) }
      end

      context "when opinion content is empty" do
        let(:opinion_attributes) { attributes_for(:opinion, content: "").merge(reporter_id: reporter.id) }

        it { is_expected.to have_http_status(:unprocessable_entity) }
      end
    end

    context "when user is not an instructor for the target api" do
      let(:user) { create(:instructor, target_api: :api_droits_cnam) }

      it { is_expected.to have_http_status(:forbidden) }
    end
  end

  describe "GET #show" do
    subject(:get_opinion) do
      get :show, params: {
        enrollment_id: enrollment.id,
        id: opinion.id
      }
    end

    let(:enrollment) { create(:enrollment, :api_particulier) }
    let(:opinion) { create(:opinion, enrollment: enrollment) }

    context "when user is an instructor for the target api" do
      let(:user) { create(:instructor, target_api: :api_particulier) }

      it { is_expected.to have_http_status(:ok) }
    end

    context "when user is a reporter for the target api" do
      let(:user) { create(:reporter, target_api: :api_particulier) }

      it { is_expected.to have_http_status(:ok) }
    end

    describe "payload" do
      subject(:payload) do
        get_opinion
        JSON.parse(response.body)
      end

      before do
        create(:opinion_comment, opinion: opinion)
      end

      let(:user) { create(:instructor, target_api: :api_particulier) }

      it "contains opinion attributes" do
        expect(payload).to include("id" => opinion.id)
        expect(payload).to include("content" => opinion.content)

        expect(payload["comments"].count).to eq(1)
      end
    end

    context "when user is not an instructor nor a reporter for the target api" do
      let(:user) { create(:instructor, target_api: :api_entreprise) }

      it { is_expected.to have_http_status(:forbidden) }
    end
  end
end
