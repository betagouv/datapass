RSpec.describe EnrollmentsController, "#copy", type: :controller do
  describe "authorization" do
    subject(:copy_enrollment) do
      post :copy, params: {
        id: enrollment.id
      }
    end

    let(:enrollment) { create(:enrollment, :franceconnect, enrollment_status, organization_kind: :clamart, user: enrollment_creator) }
    let(:enrollment_creator) { create(:user, organization_kind: :clamart) }
    let(:enrollment_status) { :draft }

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

        context "when enrollment is draft" do
          context "when user does not belong to the organization's enrollment" do
            let(:user) { create(:user, organization_kind: :dinum) }

            it { is_expected.to have_http_status(:forbidden) }

            it "should render :copy_enrollment_is_not_validated_nor_refused message" do
              expect(copy_enrollment.body).to match(I18n.t("enrollment_errors.copy_enrollment_is_not_validated_nor_refused").to_json)
            end
          end

          context "when user belongs to the organization's enrollment" do
            let(:user) { create(:user, organization_kind: :clamart) }

            it { is_expected.to have_http_status(:forbidden) }

            it "should render :copy_enrollment_is_not_validated_nor_refused message" do
              expect(copy_enrollment.body).to match(I18n.t("enrollment_errors.copy_enrollment_is_not_validated_nor_refused").to_json)
            end
          end
        end

        context "when enrollment is validated" do
          let(:enrollment_status) { :validated }

          context "when user belongs to the organization's enrollment" do
            let(:user) { create(:user, organization_kind: :clamart) }

            it { is_expected.to have_http_status(:ok) }

            context "when enrollment has already been copied and copy is not archived" do
              before do
                enrollment.copy user
              end

              it { is_expected.to have_http_status(:unprocessable_entity) }

              it "returns a JSON response with the error message" do
                expect(JSON.parse(copy_enrollment.body, symbolize_names: true)).to match({
                  title: "Cette demande a déjà été copiée",
                  message: "L’action que vous essayez de faire est impossible, car une copie de l’habilitation existe déjà. Pour continuer, veuillez utiliser cette copie."
                })
              end
            end
          end
        end
      end

      context "when user did not create this enrollment" do
        let(:enrollment_status) { :validated }

        it { is_expected.to have_http_status(:forbidden) }

        it "should render :copy_user_is_not_demandeur" do
          expect(copy_enrollment.body).to match(I18n.t("enrollment_errors.copy_user_is_not_demandeur").to_json)
        end
      end

      context "when user does not belongs to the organization's enrollment and is not a demandeur" do
        let(:user_other_organisation) { create(:user, organization_kind: :dinum) }
        let(:enrollment_status) { :validated }

        it { is_expected.to have_http_status(:forbidden) }

        it "should render :copy_user_is_not_demandeur" do
          expect(copy_enrollment.body).to match(I18n.t("enrollment_errors.copy_user_is_not_demandeur").to_json)
        end
      end
    end
  end

  describe "user does not belongs to organizations anymore" do
    subject(:copy_enrollment) do
      post :copy, params: {
        id: enrollment.id
      }
    end

    let!(:enrollment) { create(:enrollment, :franceconnect, :validated, organization_kind: :clamart, user: user_creator) }
    let(:user_creator) { create(:user, organization_kind: :clamart) }
    let(:enrollment_status) { :validated }

    before do
      login(user_creator)
    end

    context "when user was a demandeur but does not belong to the organization anymore" do
      it "should render :copy_user_do_not_belongs_to_organization" do
        user_creator.update(organizations: [{"id" => 8, "siret" => "21440109300015", "is_external" => false}])
        user_creator.reload.organizations
        enrollment.reload.demandeurs

        copy_enrollment = post :copy, params: {
          id: enrollment.id
        }

        expect(copy_enrollment.body).to eq(I18n.t("enrollment_errors.copy_user_do_not_belongs_to_organization").to_json)
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
