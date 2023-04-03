# frozen_string_literal: true

RSpec.describe EnrollmentsController, "#mark_submit_enrollment_as_read", type: :controller do
  describe "#mark_submit_enrollment_as_read" do
    subject do
      get :mark_submit_enrollment_as_read, params: {
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

    let!(:event_submit) {
      create(:event,
        name: :submit,
        enrollment_id: enrollment.id,
        user_id: enrollment.demandeurs.first.user.id,
        processed_at: nil)
    }

    before do
      login(instructor)
    end

    context "when demandeur submit an enrollment to instructors" do
      let(:enrollment_status) { :submitted }

      describe "enrollment event submit is not marked as processed" do
        it "is expected to have a submit event" do
          expect(enrollment.events.last).to eq(event_submit)
        end

        it "is expected to have processed_at field at nil" do
          expect(event_submit.processed_at).to be(nil)
        end
      end
    end

    context "when instructor mark demandeur's submit event as processed" do
      let(:enrollment_status) { :submitted }

      it { is_expected.to have_http_status(:ok) }

      before do
        Timecop.freeze
      end

      after do
        Timecop.return
      end

      it "is expected to change submit's event processed_at field with a date" do
        expect {
          subject
        }.to change { event_submit.reload.processed_at.to_i }.to eq(DateTime.now.to_i)
      end
    end

    context "when intructor has already mark an event's submit as read" do
      let(:enrollment_status) { :submitted }
      let!(:event_submit_mark_as_processed) {
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
