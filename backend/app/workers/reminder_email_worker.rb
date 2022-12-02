# frozen_string_literal: true

require "sidekiq-scheduler"

class ReminderEmailWorker
  include Sidekiq::Worker

  attr_reader :enrollment

  def initialize(enrollments)
    @enrollment = enrollments
  end

  def perform(user_id)
    # @enrollment_list = draft_enrollments
  end

  def draft_enrollments(enrollments)
    Enrollment.where(status: "draft")
      .where({updated_at: (Time.now.midnight - 1.months)..Time.now.midnight - 15.days})
  end

  # Only send an email to demandeurs if enrollment are in draft for more than 15 days without changes.
  def send?(enrollment)
  end

  def send
    # Limit the send if draft enrollment have more than 30 days.
    # Do not send email if draft enrollment are beyond 1rst November 2022
  end
end
