RSpec.describe ApiEntrepriseNotifier, type: :notifier do
  let(:instance) { described_class.new(enrollment) }

  let(:enrollment) { create(:enrollment, :api_entreprise) }
  let(:user) { create(:user) }

  describe "webhook events" do
    shared_examples "notifier webhook delivery" do
      before do
        Timecop.freeze
      end

      after do
        Timecop.return
      end

      it "calls webhook" do
        expect(DeliverEnrollmentWebhookWorker).to receive(:perform_async).with(
          enrollment.target_api,
          WebhookSerializer.new(
            enrollment,
            event
          ).serializable_hash,
          enrollment.id
        )

        subject
      end
    end

    describe "#create" do
      subject { instance.create }

      include_examples "notifier webhook delivery" do
        let(:event) { "create" }
      end
    end

    describe "#update" do
      subject { instance.update(diff: "diff", user_id: user.id) }

      include_examples "notifier webhook delivery" do
        let(:event) { "update" }
      end
    end

    describe "#notify" do
      subject { instance.notify(comment: "comment", current_user: user) }

      include_examples "notifier webhook delivery" do
        let(:event) { "notify" }
      end
    end

    describe "#request_changes" do
      subject { instance.request_changes(comment: "comment", current_user: user) }

      include_examples "notifier webhook delivery" do
        let(:event) { "request_changes" }
      end
    end

    describe "#refuse" do
      subject { instance.refuse(comment: "comment", current_user: user) }

      include_examples "notifier webhook delivery" do
        let(:event) { "refuse" }
      end
    end

    describe "#validate" do
      subject { instance.validate(comment: "comment", current_user: user) }

      include_examples "notifier webhook delivery" do
        let(:event) { "validate" }
      end
    end

    describe "#revoke" do
      subject { instance.revoke(comment: "comment", current_user: user) }

      include_examples "notifier webhook delivery" do
        let(:event) { "revoke" }
      end
    end

    describe "#delete" do
      subject { instance.delete }

      include_examples "notifier webhook delivery" do
        let(:event) { "delete" }
      end
    end
  end

  describe "emails events" do
    describe "#team_member_update" do
      let(:enrollment) { create(:enrollment, :api_entreprise, :with_delegue_protection_donnees) }

      subject { instance.team_member_update(team_member_type: "delegue_protection_donnees") }

      it "delivers an email" do
        expect {
          subject
        }.to have_enqueued_job
      end
    end
  end
end
