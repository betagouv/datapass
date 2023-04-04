# frozen_string_literal: true

RSpec.describe EnrollmentsController, "#mark_event_as_read", type: :controller do
  describe "#mark_event_as_read" do
    subject do
      get :mark_event_as_read, params: {
        id: enrollment.id,
        event_name: event_name
      }
    end

    let!(:enrollment) do
      create(
        :enrollment,
        enrollment_status,
        :franceconnect
      )
    end

    let!(:instructor) { create(:instructor, target_api: "franceconnect") }

    before do
      login(instructor)
    end

    describe "event notify - Demandeur create notify events" do
      let!(:demandeur_event_notify) {
        create(
          :event,
          name: :notify,
          enrollment_id: enrollment.id,
          user_id: enrollment.demandeurs.first.user.id,
          comment: "A meaningful comment here"
        )
      }
      let(:enrollment_status) { :draft }
      let!(:event_name) { "notify" }

      context "when demandeur's events notify are not marked as processed" do
        it "is expected to have a notify events" do
          expect(enrollment.events[0].name).to eq("notify")
        end

        it "is expected to have processed_at field at nil" do
          expect(demandeur_event_notify.processed_at).to be(nil)
        end
      end

      context "when instructor mark demandeur's event as processed" do
        let(:enrollment_status) { :draft }

        let!(:instructor_event_notify) {
          create(:event,
            name: :notify,
            enrollment_id: enrollment.id,
            user_id: instructor.id,
            comment: "some request")
        }

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
          }.to change { demandeur_event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
        end

        it "is expected to not change instructor's event processed_at field" do
          subject
          expect(instructor_event_notify.processed_at).to be(nil)
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
          expect(demandeur_event_notify.reload.processed_at).to eq(nil)
        end

        context "from submitted to change_requested" do
          let(:enrollment_status) { "changes_requested" }

          it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
            expect {
              subject
            }.to change { demandeur_event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
          end
        end

        context "from submitted to revoked" do
          let(:enrollment_status) { "revoked" }

          it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
            expect {
              subject
            }.to change { demandeur_event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
          end
        end

        context "from submitted to refused" do
          let(:enrollment_status) { "refused" }

          it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
            expect {
              subject
            }.to change { demandeur_event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
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
          expect(demandeur_event_notify.reload.processed_at).to eq(nil)
        end

        context "from change_requested to validated" do
          let(:enrollment_status) { "validated" }

          it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
            expect {
              subject
            }.to change { demandeur_event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
          end
        end

        context "from change_requested to refused" do
          let(:enrollment_status) { "refused" }

          it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
            expect {
              subject
            }.to change { demandeur_event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
          end
        end

        context "from change_requested to revoked" do
          let(:enrollment_status) { "revoked" }

          it "is expected to pass a demandeurs event's processed_at field to mark as read with changes_requested enrollment status" do
            expect {
              subject
            }.to change { demandeur_event_notify.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
          end
        end
      end
    end

    describe "event submit" do
      let!(:instructor) { create(:instructor, target_api: "franceconnect") }

      let!(:enrollment) do
        create(
          :enrollment,
          enrollment_status,
          :franceconnect
        )
      end

      let!(:event_submit) {
        create(:event,
          name: :submit,
          enrollment_id: enrollment.id,
          user_id: enrollment.demandeurs.first.user.id,
          processed_at: nil)
      }

      let!(:enrollment_status) { :submitted }
      let!(:event_name) { "submit" }

      context "When demandeur submit an enrollment to instructors" do
        context "when enrollment event submit is not marked as processed" do
          it "is expected to have a submit event" do
            expect(enrollment.events.last).to eq(event_submit)
          end

          it "is expected to have processed_at field at nil" do
            expect(event_submit.processed_at).to be(nil)
          end
        end
      end

      context "when instructor mark demandeur's submit event as processed" do
        before do
          Timecop.freeze
        end

        after do
          Timecop.return
        end

        it { is_expected.to have_http_status(:ok) }

        it "is expected to change submit's event processed_at field with a date" do
          expect {
            subject
          }.to change { event_submit.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
        end
      end

      context "when intructor has already mark an event's submit as read" do
        let(:event_submit_mark_as_processed) {
          create(:event,
            name: :submit,
            enrollment_id: enrollment.id,
            user_id: enrollment.demandeurs.first.user.id,
            processed_at: DateTime.now)
        }

        it { is_expected.to have_http_status(:ok) }

        it "is expected to not change submit's event processed_at field" do
          expect {
            subject
          }.not_to change { event_submit_mark_as_processed }
        end
      end
    end
  end
end
