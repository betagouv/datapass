# frozen_string_literal: true

require "rails_helper"

RSpec.describe ScheduleReminderEmailForDraftEnrollmentsWorker, type: :worker do
  subject { described_class.new }

  describe "#perform" do
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

    describe "email sent" do
      let(:reminder_email_sample) do
        File.open(Rails.root.join("app/views/enrollment_mailer/demandeur/reminder_draft_enrollment.text.erb")) { |f| f.readline }.chomp
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

        expect(last_email.body).to include(reminder_email_sample)
        expect(last_email.subject).to eq("Votre demande d’habilitation à FranceConnect vous attend.")
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

  describe "#perform when no draft enrollments" do
    before do
      Timecop.freeze(Time.now.change(year: 2022, month: 12))
    end

    before do
      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 30.days.ago, updated_at: 15.days.ago)
      create(:event, name: "create", enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)
      create(:event, name: "reminder", enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
    end

    after do
      Timecop.return
    end

    it "does not raise" do
      expect { subject.perform }.to_not raise_error
    end
  end
end
