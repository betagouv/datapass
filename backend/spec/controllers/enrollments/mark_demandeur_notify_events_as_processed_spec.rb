# frozen_string_literal: true

RSpec.describe EnrollmentsController, "#mark_demandeur_notify_events_as_processed", type: :controller do
  describe "#mark_demandeur_notify_events_as_processed" do
    subject do
      get :mark_demandeur_notify_events_as_processed, params: {
        id: enrollment.id
      }
    end

    let!(:instructor) { create(:instructor, target_api: "franceconnect") }
    let!(:enrollment) do
      create(
        :enrollment,
        enrollment_status,
        :franceconnect
      )
    end

    let!(:event_request_changes) {
      create(:event,
        name: :request_changes,
        enrollment_id: enrollment.id,
        user_id: instructor.id,
        comment: "some request")
    }

    let!(:event_notify) {
      create(
        :event,
        name: :notify,
        enrollment_id: enrollment.id,
        user_id: enrollment.demandeurs.first.user.id,
        comment: "A meaningful comment here"
      )
    }

    before do
      login(instructor)
    end

    context "when demandeur create notify events with draft enrollment" do
      let(:enrollment_status) { :draft }

      describe "demandeur's events notify are not marked as processed" do
        it "is expected to have 2 events" do
          expect(enrollment.events.count).to eq(2)
        end

        it "is expected to have processed_at field at nil" do
          expect(event_notify.processed_at).to be(nil)
        end
      end
    end

    context "when instructor mark demandeur's event as processed" do
      let(:enrollment_status) { :draft }

      it { is_expected.to have_http_status(:ok) }

      before do
        Timecop.freeze
      end

      after do
        Timecop.return
      end

      it "is expected to change demandeurs event's processed_at field with a date" do
        expect {
          subject
        }.to change { event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
      end

      it "is expected to not change instructor's event processed_at field" do
        subject
        expect(event_request_changes.processed_at).to be(nil)
      end
    end

    context "when enrollment status is submitted" do
      let(:enrollment_status) { :submitted }

      before do
        Timecop.freeze
      end

      after do
        Timecop.return
      end

      it "expects to have a demadeur notify event processed_at to be nil before changes requested" do
        expect(event_notify.reload.processed_at).to eq(nil)
      end

      describe "from submitted to change_requested" do
        let(:enrollment_status) { "changes_requested" }

        it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
          expect {
            subject
          }.to change { event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
        end
      end

      describe "from submitted to revoked" do
        let(:enrollment_status) { "revoked" }

        it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
          expect {
            subject
          }.to change { event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
        end
      end

      describe "from submitted to refused" do
        let(:enrollment_status) { "refused" }

        it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
          expect {
            subject
          }.to change { event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
        end
      end
    end

    context "when enrollment status is changes_requested" do
      let(:enrollment_status) { :changes_requested }

      before do
        Timecop.freeze
      end

      after do
        Timecop.return
      end

      it "expects to have a demadeur notify event processed_at to be nil before changes requested" do
        expect(event_notify.reload.processed_at).to eq(nil)
      end

      describe "from change_requested to validated" do
        let(:enrollment_status) { "validated" }

        it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
          expect {
            subject
          }.to change { event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
        end
      end

      describe "from change_requested to refused" do
        let(:enrollment_status) { "refused" }

        it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
          expect {
            subject
          }.to change { event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
        end
      end

      describe "from change_requested to revoked" do
        let(:enrollment_status) { "revoked" }

        it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
          expect {
            subject
          }.to change { event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
        end
      end
    end
  end
end
