# frozen_string_literal: true

class ReminderEmailFinder
  attr_reader :enrollment

  def initialize(enrollments)
    @enrollments = enrollments
  end

  def call
    select_draft_enrollment
  end

  def select_draft_enrollment
    # Select all draft enrollment between 15 days to 1 month to now.

    @enrollments = Enrollment.where(status: "draft")
      .where("updated_at >= ?", (Time.zone.now - 15.days) && (Time.zone.now - 1.months))
      .pluck(:id)
    # => [2201, 2304, 3494]

    # Check that enrollment has an event "update" and a reminder event
    # If not send email
    # if Event update has a diff and not event "reminder"
    # send email
    # if event update has a diff < 3 and event "reminder"
    # send email
  end
end
