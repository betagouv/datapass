# frozen_string_literal: true

require "rails_helper"

RSpec.describe ScheduleArchiveEnrollmentsWorker, type: :worker do
  subject { described_class.new }

  describe "#perform" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2))
    end

    before do
      enrollment = create(:enrollment, :api_particulier, :changes_requested, created_at: 60.days.ago, updated_at: 25.days.ago)
      create(:event, :reminder, enrollment: enrollment, created_at: 25.days.ago, updated_at: 25.days.ago)
    end

    after do
      Timecop.return
    end

    context "When there is enrollments to archive" do
      it "archive enrollments" do
        enrollment = subject.perform

        expect(enrollment[0].status).to eq("archived")
      end
    end

    context "#create_archive_event" do
      it "create an event archive when enrollment change to archived status" do
        enrollment = subject.perform

        expect(enrollment[0].events.count).to eq(2)
        expect(enrollment[0].events.last.name).to eq("archive")
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
