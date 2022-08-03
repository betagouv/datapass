# frozen_string_literal: true

RSpec.describe EnrollmentsController, "#mark_demandeur_notify_events_as_processed", type: :controller do
  describe "#mark_demandeur_notify_events_as_processed" do
    subject do
      get :mark_demandeur_notify_events_as_processed, params: {
        id: enrollment.id
      }
    end

    let!(:user) { create(:user) }
    let!(:instructor) { create(:user, roles: ["franceconnect:instructor"]) }
    let!(:enrollment) do
      create(
        :enrollment,
        :franceconnect,
        :draft,
        user: user
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
        user_id: user.id,
        comment: "A meaningful comment here"
      )
    }

    before do
      login(user)
      login(instructor)
    end

    context "when demandeur create notify events" do
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
      it "is expected to change demandeurs event's processed_at field with a date" do
        subject
        expect(event_notify.processed_at).to eq(DateTime)
      end

      it "is expected to not change instructor's event processed_at field" do
        subject
        expect(event_request_changes.processed_at).to be(nil)
      end
    end
  end
end
