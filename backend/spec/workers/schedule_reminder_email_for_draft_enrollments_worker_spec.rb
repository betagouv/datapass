# frozen_string_literal: true

require "rails_helper"

RSpec.describe ScheduleReminderEmailForDraftEnrollmentsWorker, type: :worker do
  subject { described_class.new }

  before do
    Timecop.freeze(Time.now.change(year: 2022, month: 12))
  end

  before do
    enrollment = create(:enrollment, :franceconnect, :draft, created_at: 15.days.ago, updated_at: 15.days.ago)
    create(:event, name: "create", enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
  end

  after do
    Timecop.return
  end

  describe "#perform" do
    describe "email sends to demandeurs when enrollment is in draft for more than 15 days" do
      include ActiveJob::TestHelper

      after do
        clear_enqueued_jobs
        clear_performed_jobs
      end

      context "when enrollment is in draft for 15 days" do
        it "sends email to demandeurs" do
          subject.perform

          enqueued_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs
          reminder_email = enqueued_jobs.find { |job| job["arguments"][1] == "reminder_draft_enrollment_email" }

          expect(ActiveJob::Base.queue_adapter.enqueued_jobs.size).to eq 1
          expect(reminder_email).to be_truthy
        end
      end
    end

    describe "#create_reminder_event" do
      it "create an event reminder if email is sent to demandeur" do
        reminder_enrollments = subject.perform
        enrollment = reminder_enrollments.first
        last_enrollment_event = enrollment.events.last

        expect(enrollment.events.count).to eq(2)
        expect(last_enrollment_event.name).to eq("reminder")
      end
    end
  end
end
