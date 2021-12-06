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
      expect(build(:enrollment, target_api_trait, :sent)).to be_valid, "Enrollment #{target_api_trait} factory with sent trait is not valid"
      expect(build(:enrollment, target_api_trait, :validated)).to be_valid, "Enrollment #{target_api_trait} factory with validated trait is not valid"

      begin
        create(:enrollment, target_api_trait, :sent)
      rescue ActiveRecord::RecordInvalid
        RSpec::Expectations.fail_with("#{target_api_trait} is not a valid trait factory for sent status")
      end
    end
  end

  describe "validate_application transition" do
    subject { enrollment.validate_application(params) }

    let(:user) { create(:user) }
    let(:enrollment) { create(:enrollment, target_api, :sent) }
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
end
