# frozen_string_literal: true

RSpec.describe User, type: :model do
  it "has valid factory" do
    expect(build(:user)).to be_valid
    expect(build(:user, :with_all_infos)).to be_valid
  end

  describe ".reconcile" do
    subject(:reconcile) { User.reconcile(external_user_info) }

    let(:external_user_info) do
      {
        "email" => generate(:email),
        "sub" => "1234567890",
        "given_name" => "Jean"
      }
    end

    context "when user already exists" do
      let!(:user) { create(:user, email: external_user_info["email"]) }

      it { is_expected.to eq(user) }

      it "does not create a new user" do
        expect {
          reconcile
        }.not_to change(User, :count)
      end

      it "updates attributes present in payload" do
        reconcile

        expect(user.reload.uid).to eq(external_user_info["sub"])
        expect(user.reload.given_name).to eq(external_user_info["given_name"])
      end

      context "when user has an attribute set not present in payload" do
        before do
          user.update!(
            job: "Administrateur"
          )
        end

        it "does not change this attribute" do
          expect {
            reconcile
          }.not_to change { user.reload.job }
        end
      end
    end

    context "when user does not exist" do
      it { is_expected.to be_a(User) }

      it "creates a new user" do
        expect {
          reconcile
        }.to change(User, :count).by(1)
      end

      it "assign to new user attributes present in payload" do
        user = reconcile

        expect(user.reload.uid).to eq(external_user_info["sub"])
        expect(user.reload.given_name).to eq(external_user_info["given_name"])
      end
    end

    describe "with a full payload" do
      let(:external_user_info) do
        {
          "email" => generate(:email),
          "sub" => "1234567890",
          "email_verified" => true,
          "family_name" => "Dupont",
          "given_name" => "Jean",
          "phone_number" => "0636656565",
          "job" => "Administrator",
          "organizations" => %w[DINUM]
        }
      end

      it "updates all fields" do
        user = reconcile

        expect(user.uid).to eq(external_user_info["sub"])

        external_user_info.except("sub").each do |key, value|
          expect(user.public_send(key)).to eq(value), "##{key} is not valid"
        end
      end
    end
  end
end
