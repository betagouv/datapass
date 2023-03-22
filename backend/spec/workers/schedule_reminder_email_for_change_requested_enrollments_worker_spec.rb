# frozen_string_literal: true

require "rails_helper"

RSpec.describe ScheduleReminderEmailForChangeRequestedEnrollmentsWorker, type: :worker do
  subject { described_class.new }

  describe "#perform" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2, day: 1))
    end

    before do
      enrollment = create(:enrollment, :franceconnect, :changes_requested, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :create, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :submit, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :request_changes, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :update, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
    end

    after do
      Timecop.return
    end

    describe "email sends to demandeurs when enrollment is in changes_requested status for more than 6 months" do
      include ActiveJob::TestHelper

      after do
        clear_enqueued_jobs
        clear_performed_jobs
      end

      context "when enrollment is in changes_requested status for more than 6 months" do
        it "sends email to demandeurs" do
          subject.perform

          enqueued_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs
          reminder_email = enqueued_jobs.find { |job| job["arguments"][1] == "reminder_changes_requested_enrollment_email" }

          expect(ActiveJob::Base.queue_adapter.enqueued_jobs.size).to eq 1
          expect(reminder_email).to be_truthy
        end
      end
    end

    describe "email sent" do
      let(:reminder_changes_requested_sample) do
        File.open(Rails.root.join("app/views/enrollment_mailer/demandeur/reminder_changes_requested_enrollment.text.erb")) { |f| f.readline }.chomp
      end

      before do
        ActiveJob::Base.queue_adapter = :inline
      end

      after do
        ActiveJob::Base.queue_adapter = :test
      end

      it "delivers a return receipt email to current user" do
        expect {
          subject.perform
        }.to change(ActionMailer::Base.deliveries, :count).by(1)

        last_email = ActionMailer::Base.deliveries.last

        expect(last_email.body).to include(reminder_changes_requested_sample)
        expect(last_email.subject).to eq("Votre demande d’habilitation à FranceConnect vous attend.")
      end
    end

    describe "#create_reminder_event" do
      it "create an event reminder if email is sent to demandeur" do
        reminder_enrollments = subject.perform
        enrollment = reminder_enrollments.first
        last_enrollment_event = enrollment.events.last

        expect(enrollment.events.count).to eq(5)
        expect(last_enrollment_event.name).to eq("reminder_before_archive")
      end
    end
  end

  describe "#perform when there is no changes_requested enrollments" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2, day: 1))
    end

    before do
      enrollment = create(:enrollment, :franceconnect, :changes_requested, created_at: 7.months.ago, updated_at: 6.months.ago)
      create(:event, :create, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :request_changes, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: 6.months.ago, updated_at: 6.months.ago)
    end

    after do
      Timecop.return
    end

    it "does not raise" do
      expect { subject.perform }.to_not raise_error
    end
  end
end
