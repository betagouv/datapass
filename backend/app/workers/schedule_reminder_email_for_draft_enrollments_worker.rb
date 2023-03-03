# frozen_string_literal: true

require "sidekiq-scheduler"

class ScheduleReminderEmailForDraftEnrollmentsWorker < ApplicationWorker
  sidekiq_options queue: "reminders"

  def perform
    ExtractDraftEnrollmentsToRemind.new.call.each do |draft_enrollment|
      send_reminder_email(draft_enrollment)
      create_reminder_event(draft_enrollment)
    end
  end

  def send_reminder_email(enrollment)
    EnrollmentReminderMailer.with(
      target_api: enrollment.target_api,
      enrollment_id: enrollment.id
    ).reminder_draft_enrollment_email.deliver_later
  end

  def create_reminder_event(enrollment)
    enrollment.events.create!(name: "reminder")
  end
end
