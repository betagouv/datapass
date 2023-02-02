# frozen_string_literal: true

require "sidekiq-scheduler"

class ScheduleReminderEmailForChangeRequestedEnrollmentsWorker
  include Sidekiq::Worker

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
    enrollment.events.create!(name: "reminder")
  end
end
