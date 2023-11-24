RSpec.describe ReopenEnrollment, type: :organizer do
  subject(:reopen_enrollment) { described_class.call(enrollment: enrollment, user: user) }

  let(:user) { create(:user) }
  let(:enrollment) { create(:enrollment, :api_particulier, enrollment_status) }

  context "when enrollment is validated" do
    let(:enrollment_status) { :validated }

    it { is_expected.to be_success }

    it "changes enrollment status to pending" do
      expect {
        reopen_enrollment
      }.to change { enrollment.reload.status }.from("validated").to("draft")
    end

    it "creates a new event" do
      expect {
        reopen_enrollment
      }.to change(Event, :count).by(1)

      expect(enrollment.reload.events.last.name).to eq("reopen")
    end
  end

  context "when enrollment is not validated" do
    let(:enrollment_status) { :submitted }

    it { is_expected.to be_a_failure }

    it "sets errors" do
      expect(reopen_enrollment.errors).to be_present
    end
  end
end
