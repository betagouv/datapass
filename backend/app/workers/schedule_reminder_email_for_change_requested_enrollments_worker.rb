# frozen_string_literal: true

require "sidekiq-scheduler"

class ScheduleReminderEmailForChangeRequestedEnrollmentsWorker < ApplicationWorker
  sidekiq_options queue: "reminders"

  def perform
    ExtractChangesRequestedEnrollmentsToArchive.new.call.each do |changes_requested_enrollment|
      send_reminder_email(changes_requested_enrollment)
      create_reminder_event(changes_requested_enrollment)
    end
  end

  def send_reminder_email(enrollment)
    EnrollmentReminderMailer.with(
      target_api: enrollment.target_api,
      enrollment_id: enrollment.id
    ).reminder_changes_requested_enrollment_email.deliver_later
  end

  def create_reminder_event(enrollment)
    enrollment.events.create!(name: "reminder_before_archive")
  end
end
