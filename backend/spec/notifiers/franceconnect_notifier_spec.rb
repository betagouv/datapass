RSpec.describe FranceconnectNotifier, type: :notifier do
  let(:instance) { described_class.new(enrollment) }
  let(:user) { create(:user) }
  let(:enrollment) { create(:enrollment, :franceconnect) }

  describe "webhook events" do
    describe "#validate" do
      subject { instance.validate(comment: "ok", current_user: user) }

      it "delivers an email" do
        expect do
          subject
        end.to have_enqueued_job(ActionMailer::MailDeliveryJob)
      end

      it "calls hubspot registration" do
        expect(RegisterOrganizationWithContactsOnHubspotWorker).to receive(:perform_async).with(enrollment.id)

        subject
      end
    end
  end
end
