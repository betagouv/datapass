RSpec.describe EnrollmentsController, "#unarchive", type: :controller do
  describe "#unarchive" do
    subject do
      patch :unarchive, params: {
        id: enrollment.id,
        enrollment_status: enrollment.status
      }
    end

    let(:administrator) { create(:user, roles: ["administrator", "franceconnect:instructor"]) }

    before do
      login(administrator)
    end

    context "when administrator change status from archive to unarchive" do
      let(:enrollment) do
        create(
          :enrollment,
          enrollment_status,
          :franceconnect
        )
      end
      let(:enrollment_status) { :submitted }

      let(:event) {
        create(
          :event,
          name: "submit",
          enrollment_id: enrollment.id
        )
      }

      it "is expected to change enrollment status from archive to unarchive" do
        enrollment.update(status: "archived")
        create(
          :event,
          name: "archive",
          enrollment_id: enrollment.id
        )

        expect {
          # byebug
          subject
        }.to change { enrollment.reload.status }.to("submitted")

        expect(enrollment.events.last.name).to eq("unarchive")
      end
    end
  end
end
