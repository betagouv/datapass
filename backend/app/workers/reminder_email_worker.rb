# frozen_string_literal: true

require "sidekiq-scheduler"

class ReminderEmailWorker
  include Sidekiq::Worker

  def perform(user_id)
    ReminderEmailFinder.call
    # For Each enrollments
    # Get user_id d'enrollment  / user_id = enrollment.demandeurs.first
    # @enrollment_list = draft_enrollments
  end

  # Only send an email to demandeurs if enrollment are in draft for more than 15 days without changes.
  def send?(enrollment)
  end

  def send
    # Limit the send if draft enrollment have more than 30 days.
    # Do not send email if draft enrollment are beyond 1rst November 2022
  end
end
