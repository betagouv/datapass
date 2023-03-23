# frozen_string_literal: true

require "rails_helper"

RSpec.describe ScheduleArchiveAfterReminderWorker, type: :worker do
  subject { described_class.new }

  describe "#perform" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2))
    end

    before do
      enrollment = create(:enrollment, :api_particulier, :changes_requested, created_at: 60.days.ago, updated_at: 25.days.ago)
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: 25.days.ago, updated_at: 25.days.ago)
    end

    after do
      Timecop.return
    end

    context "When there is enrollments to archive" do
      it "archive enrollments" do
        result = subject.perform
        enrollment = Enrollment.find(result[0].enrollment_id)

        expect(enrollment.status).to eq("archived")
      end
    end

    context "#create_archive_event" do
      it "create an event archive when enrollment change to archived status" do
        result = subject.perform
        expect(result[0].name).to eq("archive")

        enrollment = Enrollment.find(result[0].enrollment_id)
        expect(enrollment.events.count).to eq(2)
      end
    end
  end

  describe "#perform when there is no enrollments to archive " do
    before do
      Timecop.freeze(Time.now.change(year: 2022, month: 12))
    end

    before do
      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 30.days.ago, updated_at: 15.days.ago)
      create(:event, name: "create", enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)
      create(:event, name: "reminder_before_archive", enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
    end

    after do
      Timecop.return
    end

    it "does not raise" do
      expect { subject.perform }.to_not raise_error
    end
  end
end
