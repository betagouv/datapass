# frozen_string_literal: true

require "sidekiq-scheduler"

class ReminderEmailWorker
  include Sidekiq::Worker

  def perform(*args)
    # Do something
    # Enrollment.updated_at
  end

  private

  # Only send an email to demandeurs if enrollment are in draft for more than 15 days without changes.
  def send?(enrollment)
  end

  def send
    # Limit the send if draft enrollment have more than 30 days.
    # Do not send email if draft enrollment are beyond 1rst November 2022
  end
end
