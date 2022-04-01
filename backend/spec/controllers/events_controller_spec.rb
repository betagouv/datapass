RSpec.describe EventsController, type: :controller do
  describe "#most_used_comments" do
    subject(:most_used_comments_request) do
      get :most_used_comments, params: {
        event: event,
        target_api: "api_entreprise"
      }
    end

    let!(:some_comments) do
      enrollment = create(:enrollment, :api_entreprise, :validated)
      create(:event, :request_changes, enrollment: enrollment, comment: "Il y a un serpent dans ma botte !")
      create(:event, :request_changes, enrollment: enrollment, comment: "Il y a un serpent dans ma botte !")
      create(:event, :request_changes, enrollment: enrollment, comment: "Les mains en l’air !")
    end

    let(:user) { create(:user) }

    describe "without user" do
      let(:event) { "request_changes" }

      it { is_expected.to have_http_status(:unauthorized) }
    end

    context "with user" do
      before do
        login(user)
      end
      describe "should return bad request with unknown event name" do
        let(:event) { "does_not_exist" }

        it { is_expected.to have_http_status(:bad_request) }
      end

      describe "should return forbidden" do
        let(:event) { "request_changes" }

        it { is_expected.to have_http_status(:forbidden) }
      end

      context "with instructor rights" do
        let(:user) { create(:user, roles: ["api_entreprise:instructor"]) }
        let(:event) { "request_changes" }

        it { is_expected.to have_http_status(:ok) }

        it "return the most used comment" do
          result = JSON.parse(most_used_comments_request.body)
          expect(result).to eq([{"comment" => "Il y a un serpent dans ma botte !"}])
        end
      end
    end
  end
end
