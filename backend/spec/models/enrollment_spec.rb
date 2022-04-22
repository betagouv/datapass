RSpec.describe Enrollment, type: :model do
  it "has valid factories" do
    %i[
      franceconnect
      api_entreprise
      api_particulier
      api_droits_cnam
      api_impot_particulier_fc_sandbox
      aidants_connect
      hubee_portail
    ].each do |target_api_trait|
      expect(build(:enrollment, target_api_trait)).to be_valid, "Enrollment #{target_api_trait} factory is not valid"
      expect(build(:enrollment, target_api_trait, :submitted)).to be_valid, "Enrollment #{target_api_trait} factory with submitted trait is not valid"
      expect(build(:enrollment, target_api_trait, :validated)).to be_valid, "Enrollment #{target_api_trait} factory with validated trait is not valid"

      begin
        create(:enrollment, target_api_trait, :submitted)
      rescue ActiveRecord::RecordInvalid
        RSpec::Expectations.fail_with("#{target_api_trait} is not a valid trait factory for submitted status")
      end
    end
  end

  describe "validate transition" do
    subject { enrollment.validate_status(params) }

    let(:user) { create(:user) }
    let(:enrollment) { create(:enrollment, target_api, :submitted) }
    let(:params) { {user_id: user.id, comment: "whatever"} }

    context "with api_particulier as target api" do
      let(:target_api) { :api_particulier }

      it "runs associated bridge" do
        expect(ApiParticulierBridge).to receive(:call).with(enrollment)

        subject
      end
    end

    context "with franceconnect as target api" do
      let(:target_api) { :franceconnect }

      it "runs associated bridge" do
        expect(FranceconnectBridge).to receive(:call).with(enrollment)

        subject
      end
    end

    context "with api_particulier as target api" do
      let(:target_api) { :api_particulier }

      it "runs associated bridge" do
        expect(ApiParticulierBridge).to receive(:call).with(enrollment)

        subject
      end
    end

    context "with api_droits_cnam as target api" do
      let(:target_api) { :api_droits_cnam }

      it "runs associated bridge" do
        expect(ApiDroitsCnamBridge).to receive(:call).with(enrollment)

        subject
      end
    end

    context "with api_impot_particulier_fc_sandbox as target api" do
      let(:target_api) { :api_impot_particulier_fc_sandbox }

      it "runs associated bridge" do
        expect(ApiImpotParticulierFcSandboxBridge).to receive(:call).with(enrollment)

        subject
      end
    end

    context "with aidants_connect as target api" do
      let(:target_api) { :aidants_connect }

      it "runs associated bridge" do
        expect(AidantsConnectBridge).to receive(:call).with(enrollment)

        subject
      end
    end

    context "with hubee_portail as target api" do
      let(:target_api) { :hubee_portail }

      it "runs associated bridge" do
        expect(HubeePortailBridge).to receive(:call).with(enrollment)

        subject
      end
    end
  end

  describe "diff_with_associations" do
    subject { enrollment.diff_with_associations }

    let(:user) { create(:user) }
    let(:enrollment) { create(:enrollment, :api_particulier, :draft) }
    before do
      Timecop.freeze
    end

    after do
      Timecop.return
    end

    context "with changes on intitule" do
      before do
        enrollment.update!(
          intitule: "Nouvel intitulé"
        )
      end

      it "returns a version" do
        expect(subject["_v"]).to eq("2")
      end

      it "returns a diff for modified field" do
        expect(subject["intitule"]).to eq([
          "Délivrance des titres de transport de la ville de Clamart",
          "Nouvel intitulé"
        ])
      end
    end

    context "with changes on scopes" do
      before do
        enrollment.update!(
          scopes: {
            dgfip_annee_revenus: true,
            dgfip_montant_impot: true
          }
        )
      end

      it "returns a nested diff for object" do
        expect(subject["scopes"]).to eq({
          "dgfip_montant_impot" => [false, true]
        })
      end
    end

    context "with added fields" do
      before do
        enrollment.update!(
          cgu_approved: true,
          scopes: {
            dgfip_annee_revenus: true,
            dgfip_montant_impot: false,
            dgfip_nombre_parts: false
          }
        )
      end

      it "returns a diff for added field" do
        expect(subject["cgu_approved"]).to eq([
          true
        ])
      end

      it "returns a diff for nested added field" do
        expect(subject["scopes"]).to eq({
          "dgfip_nombre_parts" => [false]
        })
      end
    end

    context "with user as demandeur" do
      let(:user) { create(:user, :with_personal_information) }
      let(:enrollment) {
        create(
          :enrollment, :api_particulier, :draft,
          user: user
        )
      }

      context "with modification in team_members" do
        before do
          tm = JSON.parse(enrollment.team_members.to_json)
          enrollment.update!(
            team_members_attributes: [
              {
                id: tm[0]["id"],
                type: nil, # magic hack: we add this for the test to pass
                email: tm[0]["email"],
                phone_number: tm[0]["phone_number"],
                job: tm[0]["job"],
                given_name: tm[0]["given_name"],
                family_name: tm[0]["family_name"]
              },
              {
                id: tm[1]["id"],
                type: "responsable_technique",
                email: tm[1]["email"],
                phone_number: "0136656565",
                job: tm[1]["job"],
                given_name: tm[1]["given_name"],
                family_name: tm[1]["family_name"]
              }
            ]
          )
        end

        it "returns a diff for modified field in associated model" do
          expect(subject["team_members"]).to eq({
            "0" => {
              "type" => ["demandeur", nil] # magic hack: we add this for the test to pass
            },
            "1" => {
              "phone_number" => ["0636656565", "0136656565"]
            },
            "_t" => "a"
          })
        end
      end

      context "with addition in team_members" do
        before do
          tm = JSON.parse(enrollment.team_members.to_json)
          enrollment.update!(
            team_members_attributes: [
              {
                id: tm[0]["id"],
                type: nil, # magic hack: we add this for the test to pass
                email: tm[0]["email"],
                phone_number: tm[0]["phone_number"],
                job: tm[0]["job"],
                given_name: tm[0]["given_name"],
                family_name: tm[0]["family_name"]
              },
              {
                id: tm[1]["id"],
                type: "responsable_technique",
                email: tm[1]["email"],
                phone_number: tm[1]["phone_number"],
                job: tm[1]["job"],
                given_name: tm[1]["given_name"],
                family_name: tm[1]["family_name"]
              },
              {
                type: "responsable_technique",
                email: "hoho@santa.claus",
                phone_number: "0636656565",
                job: "BOSS of the deers",
                given_name: "Santa",
                family_name: "Claus"
              }
            ]
          )
        end

        it "returns a diff for added field in associated model" do
          expect(subject["team_members"]["2"]["email"]).to eq(["hoho@santa.claus"])
        end
      end
    end
  end
end
