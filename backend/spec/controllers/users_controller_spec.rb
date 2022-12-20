# frozen_string_literal: true

RSpec.describe UsersController, type: :controller do
  describe "#me" do
    subject(:make_call) { get :me }

    let(:user) { create(:user, :with_all_infos) }

    before do
      login(user)
    end

    it { is_expected.to have_http_status(:ok) }

    it "renders user's attributes" do
      make_call

      expect(user.attributes).to include(JSON.parse(response.body))
    end
  end

  describe "#index" do
    subject(:users_index) do
      get :index, params: {
        users_with_roles_only: users_with_roles_only
      }
    end

    let(:users_with_roles_only) { nil }

    before do
      login(user)
    end

    context "when user is not an admin" do
      let(:user) { create(:user) }

      it { is_expected.to have_http_status(:forbidden) }
    end

    context "when user is an admin" do
      let(:user) { create(:user, :administrator) }

      it { is_expected.to have_http_status(:ok) }

      describe "payload" do
        subject(:users_index_payload) do
          get :index, params: {
            users_with_roles_only: users_with_roles_only
          }

          JSON.parse(response.body)["users"]
        end

        let!(:first_user_with_role) { create(:user, email: "a#{generate(:email)}", roles: ["whatever"]) }
        let!(:second_user_without_role) { create(:user, email: "b#{generate(:email)}", roles: []) }

        it "renders all users ordered by email" do
          expect(users_index_payload.count).to eq(3)

          expect(users_index_payload.map { |user_payload| user_payload["id"] }).to eq([
            first_user_with_role.id,
            second_user_without_role.id,
            user.id
          ])
        end

        context "when users_with_roles_only is set to true" do
          let(:users_with_roles_only) { true }

          it "renders users with roles only" do
            expect(users_index_payload.count).to eq(2)

            expect(users_index_payload.map { |user_payload| user_payload["id"] }).to eq([
              first_user_with_role.id,
              user.id
            ])
          end
        end
      end

      describe "filter email" do
        subject(:users_index_payload) do
          get :index, params: {
            users_with_roles_only: users_with_roles_only,
            filter: [{
              "email" => searched_user_email_filter
            }].to_json
          }

          JSON.parse(response.body)["users"]
        end

        let!(:searched_user_email_filter) { searched_user_email.first(5) }
        let!(:first_user_with_role) { create(:user, email: "a#{generate(:email)}", roles: ["whatever"]) }
        let!(:second_user_without_role) { create(:user, email: "b#{generate(:email)}", roles: []) }
        let!(:third_user_without_role) { create(:user, email: "c#{generate(:email)}", roles: []) }
        let!(:other_user_with_role) { create(:user, email: "c#{generate(:email)}", roles: ["whatever"]) }

        context "when admin user filter email with an unknow email" do
          let(:users_with_roles_only) { false }
          let(:searched_user_email) { "unknown" }

          it "renders no user" do
            expect(users_index_payload.count).to eq(0)
          end
        end

        context "when filter email by roles" do
          let(:users_with_roles_only) { true }
          let(:searched_user_email) { "cu" }

          it "renders users with 'cu' in email and with roles only" do
            expect(users_index_payload.count).to eq(1)

            expect(users_index_payload.map { |user_payload| user_payload["id"] }).to eq([
              other_user_with_role.id
            ])
          end
        end

        context "when filter email when email's user start with filter search" do
          let(:users_with_roles_only) { false }
          let(:searched_user_email) { "cu" }

          it "renders users with 'cu' includes in their emails" do
            expect(users_index_payload.count).to eq(2)
            expect(users_index_payload.map { |user_payload| user_payload["id"] }).to eq([
              third_user_without_role.id,
              other_user_with_role.id
            ])
          end
        end

        context "when email's user with role only include filter search at the end of emails" do
          let(:users_with_roles_only) { true }
          let(:searched_user_email) { "ser" }

          it "renders users with 'cu' includes in their emails" do
            expect(users_index_payload.count).to eq(3)
            expect(users_index_payload.map { |user_payload| user_payload["id"] }).to eq([
              first_user_with_role.id,
              other_user_with_role.id,
              user.id
            ])
          end
        end
      end
    end
  end

  describe "#update" do
    subject(:update_user) do
      put :update, params: {
        id: user_updated.id,
        user: user_updated_params
      }
    end

    let(:user_updated) { create(:user) }
    let(:user_updated_params) do
      {
        given_name: "not relevant",
        roles: ["hello"]
      }
    end

    before do
      login(user)
    end

    context "when user is not an admin" do
      let(:user) { create(:user) }

      it { is_expected.to have_http_status(:forbidden) }
    end

    context "when user is an admin" do
      let(:user) { create(:user, :administrator) }

      it { is_expected.to have_http_status(:ok) }

      it "updates roles" do
        expect {
          update_user
        }.to change { user_updated.reload.roles }.to(user_updated_params[:roles])
      end

      it "does not update other attributes" do
        expect {
          update_user
        }.not_to change { user_updated.reload.given_name }
      end
    end
  end

  describe "#create" do
    subject(:create_user) do
      post :create, params: {
        email: email
      }
    end
    let(:email) { generate(:email) }

    before do
      login(user)
    end

    context "when user is not an admin" do
      let(:user) { create(:user) }

      it { is_expected.to have_http_status(:forbidden) }

      it "should not create a new user" do
        expect {
          create_user
        }.not_to change { User.count }
      end
    end

    context "when user is an admin" do
      let(:user) { create(:user, :administrator) }

      it { is_expected.to have_http_status(:ok) }

      context "when email is already taken" do
        before do
          create(:user, email: email)
        end

        it { is_expected.to have_http_status(:unprocessable_entity) }
      end

      context "when email is not already taken" do
        it "creates a new user" do
          expect {
            create_user
          }.to change { User.count }.by(1)
        end

        it { is_expected.to have_http_status(:ok) }
      end
    end
  end

  describe "#join_organization" do
    subject(:join_organization) do
      get :join_organization
    end

    context "without a user" do
      it { is_expected.to have_http_status(:redirect) }
    end

    context "with a user" do
      let(:user) { create(:user) }

      before do
        login(user)
      end

      it "logs out user" do
        join_organization

        get :me

        expect(response).to have_http_status(:unauthorized)
      end

      it "redirects to oauth join organization path" do
        join_organization

        expect(response).to redirect_to("#{ENV.fetch("OAUTH_HOST")}/users/join-organization")
      end
    end
  end

  describe "#personal_information" do
    subject(:personal_information) do
      get :personal_information
    end

    context "without a user" do
      it { is_expected.to have_http_status(:redirect) }
    end

    context "with a user" do
      let(:user) { create(:user) }

      before do
        login(user)
      end

      it "logs out user" do
        personal_information

        get :me

        expect(response).to have_http_status(:unauthorized)
      end

      it "redirects to oauth join organization path" do
        personal_information

        expect(response).to redirect_to("#{ENV.fetch("OAUTH_HOST")}/users/personal-information")
      end
    end
  end
end
