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

  describe "copy validations" do
    let(:enrollment_creator) { create(:user, organization_kind: :clamart) }
    let(:enrollment) {
      create(:enrollment, :franceconnect, status: "validated", organization_kind: :clamart, user: enrollment_creator)
    }

    it "can't create 2 copies for the same enrollment" do
      create(:enrollment, :franceconnect, status: "validated", copied_from_enrollment_id: enrollment.id, organization_kind: :clamart, user: enrollment_creator)
      copy_enrollment = enrollment.copy enrollment_creator

      expect(copy_enrollment).not_to be_valid
    end

    it "can create a copy if first copy enrollment has status archived" do
      create(:enrollment, :franceconnect, status: "archived", copied_from_enrollment_id: enrollment.id, organization_kind: :clamart, user: enrollment_creator)
      copy_enrollment = enrollment.copy enrollment_creator

      expect(copy_enrollment).to be_valid
    end
  end

  describe "state_machine" do
    let(:states) { [:draft, :submitted, :changes_requested, :validated, :refused, :revoked, :archived] }

    it "has valid states in state_machine" do
      expect(Enrollment.state_machine.states.map(&:name)).to eq(states)
    end
  end

  describe "validate transition" do
    subject { enrollment.validate_status(params) }

    let(:user) { create(:user) }
    let(:enrollment) { create(:enrollment, target_api, :submitted) }
    let(:params) { {user_id: user.id, comment: "whatever"} }

    describe "snapshotting" do
      let(:target_api) { :api_entreprise }

      it "updates last_validated_at" do
        expect {
          subject
        }.to change { enrollment.reload.last_validated_at }
      end

      it "creates a snapshot of this model " do
        expect {
          subject
        }.to change { enrollment.reload.snapshots.count }.by(1)
      end
    end

    context "with aidants_connect as target api" do
      let(:target_api) { :aidants_connect }

      it "runs associated bridge" do
        expect(AidantsConnectBridge).to receive(:call).with(enrollment)

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

    context "with changes on intitule" do
      before do
        enrollment.update!(
          intitule: "Nouvel intitulé"
        )
      end

      it "returns a version" do
        expect(subject["_v"]).to eq("3")
      end

      it "returns a diff for modified field" do
        expect(subject["intitule"]).to eq([
          "Délivrance des titres de transport de la ville de Clamart",
          "Nouvel intitulé"
        ])
      end

      it "does not return diff for updated_at field" do
        expect(subject).not_to have_key("updated_at")
      end
    end

    context "with changes on scopes" do
      before do
        enrollment.update!(
          scopes: [
            "cnaf_quotient_familial",
            "cnaf_allocataires"
          ]
        )
      end

      it "returns a nested diff for object" do
        expect(subject["scopes"]).to eq([
          ["cnaf_quotient_familial"],
          ["cnaf_quotient_familial", "cnaf_allocataires"]
        ])
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
                type: "demandeur",
                email: tm[0]["email"],
                phone_number: "0603821213",
                job: "Full-Stack Engineer",
                given_name: "Josè",
                family_name: "Garcia"
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
              "given_name" => ["Jean", "Josè"],
              "family_name" => ["Dupont", "Garcia"],
              "job" => ["Administrateur", "Full-Stack Engineer"],
              "phone_number" => ["0636656565", "0603821213"]
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

      context "with modification of a non-sanitized phone_number in team_members" do
        before do
          tm = JSON.parse(enrollment.team_members.to_json)
          enrollment.update!(
            team_members_attributes: [
              {
                id: tm[0]["id"],
                type: "demandeur",
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
                phone_number: "0158453286‬",
                job: tm[1]["job"],
                given_name: tm[1]["given_name"],
                family_name: tm[1]["family_name"]
              }
            ]
          )
        end

        it "returns a diff for modified phone_number with sanitized value in associated model" do
          expect(subject["team_members"]["1"]["phone_number"]).to eq(["0636656565", "0158453286"])
        end
      end
    end
  end

  describe "groups" do
    subject { enrollment.groups }

    let(:user) { create(:user) }
    let(:enrollment) { create(:enrollment, :franceconnect, :draft) }

    context "with no groups configured" do
      it "returns an empty array" do
        expect(subject).to eq([])
      end
    end
  end

  describe "subscribers" do
    subject { enrollment.subscribers }

    let(:enrollment) { create(:enrollment, :franceconnect, :draft) }

    it "does not return subscribers from other API" do
      create(:user, roles: ["fake_target_api"])
      create(:user, roles: ["api_particulier:subscriber"])
      create(:user, roles: ["api_particulier:cnaf:subscriber"])

      expect(subject.any?).to be_falsey
    end

    it "does not return subscribers from other API" do
      create(:user, roles: ["franceconnect:subscriber"])

      expect(subject.to_a.length).to eq(1)
    end

    it "does not return subscribers from unknown group" do
      create(:user, roles: ["franceconnect:unknown_group:subscriber"])

      expect(subject.any?).to be_falsey
    end
  end
end
