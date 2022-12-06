# frozen_string_literal: true

require "rails_helper"

RSpec.describe ReminderEmailFinder, type: :worker do
  subject { described_class.new(enrollments) }

  before do
    Timecop.freeze

    enrollment = create(:enrollment, :api_particulier, :submitted, created_at: 60.days.ago, updated_at: 30.days.ago)
    create(:event, :create, enrollment: enrollment, created_at: 60.days.ago, updated_at: 60.days.ago)
    create(:event, :submit, enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)

    enrollment = create(:enrollment, :franceconnect, :draft, created_at: 60.days.ago, updated_at: 15.days.ago)
    create(:event, :create, enrollment: enrollment, created_at: 60.days.ago, updated_at: 60.days.ago)
    create(:event, :update, enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)
    create(:event, :reminder, enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)

    enrollment = create(:enrollment, :api_entreprise, :validated, created_at: 35.days.ago, updated_at: 30.days.ago)
    create(:event, :create, enrollment: enrollment, created_at: 35.days.ago, updated_at: 35.days.ago)
    create(:event, :update, enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)
    create(:event, :validate, enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)

    enrollment = create(:enrollment, :api_particulier, :draft, created_at: 30.days.ago, updated_at: 20.days.ago)
    create(:event, :create, enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)
    create(:event, :update, enrollment: enrollment, diff: "some diff", created_at: 20.days.ago, updated_at: 20.days.ago)

    enrollment = create(:enrollment, :api_entreprise, :draft, created_at: 20.days.ago, updated_at: 17.days.ago)
    create(:event, :create, enrollment: enrollment, created_at: 20.days.ago, updated_at: 20.days.ago)
    create(:event, :notify, comment: "some comment", enrollment: enrollment, created_at: 19.days.ago, updated_at: 19.days.ago)
    create(:event, :update, enrollment: enrollment, diff: "diff", created_at: 18.days.ago, updated_at: 18.days.ago)
    create(:event, :update, enrollment: enrollment, diff: "other diff", created_at: 17.days.ago, updated_at: 17.days.ago)

    enrollment = create(:enrollment, :franceconnect, :refused, created_at: 30.days.ago, updated_at: 16.days.ago)
    create(:event, :notify, comment: "some comment", enrollment: enrollment, created_at: 18.days.ago, updated_at: 18.days.ago)
    create(:event, :refuse, comment: "some other comment", enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)

    enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 16.days.ago, updated_at: 16.days.ago)
    create(:event, :create, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
    create(:event, :notify, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
    create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)

    enrollment = create(:enrollment, :franceconnect, :draft, created_at: 15.days.ago, updated_at: 15.days.ago)
    create(:event, name: "create", enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)

    enrollment = create(:enrollment, :api_entreprise, :draft, created_at: 5.days.ago, updated_at: 5.days.ago)
    create(:event, :create, enrollment: enrollment, created_at: 5.days.ago, updated_at: 5.days.ago)
  end

  after do
    Timecop.return
  end

  let!(:enrollments) { Enrollment.all }

  context "#draft_enrollments" do
    it "renders draft enrollments between 15 days and a month ago" do
      result = subject.draft_enrollments(enrollments)

      expect(result.count).to eq(5)
    end

    it "includes draft enrollment with no notify events" do
      result = subject.draft_enrollments(enrollments)
      events = result.map { |enrollment| enrollment.events.map(&:name) }.flatten

      expect(events).to include("create", "update", "reminder")
      expect(events).not_to include("notify")
    end

    it "orders enrollment by id and last events created" do
      result = subject.draft_enrollments(enrollments)
      event_names = result.collect { |e| e.events.map(&:name) }
      event_ids = result.collect { |e| e.events.ids }

      expect(event_names[0].last).to eq("reminder")
      expect(event_ids[0].last).to eq(result[0].events.last.id)
    end
  end

  context "#draft_with_last_events_updated_at_or_created_at" do
    it "renders draft enrollment with update_at or created_at as last events" do
      result = subject.draft_enrollment_last_events_updated_at_or_created_at(enrollments)
      events = result.map { |event| event.name }.flatten

      expect(result.count).to eq(4)
      expect(events).to include("create", "update")
    end
  end

  context "when testing filters method result for algo" do
    it "check #created_at_updated_at_last_events? got result" do
      result = subject.created_at_updated_at_last_events?

      expect(result).to be_truthy
    end
  end

  # describe "email sends to demandeurs when enrollment is in draft for more than 15 days" do
  #   include ActiveJob::TestHelper
  #
  #   after do
  #     clear_enqueued_jobs
  #     clear_performed_jobs
  #   end
  #
  #   context "when enrollment is in draft for 15 days" do
  #     describe "non-regression test" do
  #       it "enqueues an EmailNotifierMethods#deliver_reminder_email_to_demandeur which does not raise an error" do
  #         Sidekiq::Testing.inline!
  #
  #         expect {
  #           perform_enqueued_jobs do
  #             subject.algo
  #           end
  #         }.not_to raise_error
  #
  #         Sidekiq::Testing.fake!
  #       end
  #     end
  #
  #     it "sends email to target_api subscribers" do
  #       subject.algo
  #
  #       enqueued_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs
  #       reminder_email = enqueued_jobs.find { |job| job["arguments"][1] == "reminder_draft_enrollment_email" }
  #
  #       expect(ActiveJob::Base.queue_adapter.enqueued_jobs.size).to eq 1
  #       expect(reminder_email).to be_truthy
  #     end
  #   end
  # end

  describe "#create_reminder_event" do
    it "create an event reminder if email is sent to demandeur" do
      event_reminder = subject.algo
      enrollment = event_reminder.first
      last_enrollment_event = enrollment.events.last

      expect(last_enrollment_event.name).to eq("reminder")
      # expect(last_enrollment_event.created_at).to be(Time.now)
    end
  end
end
