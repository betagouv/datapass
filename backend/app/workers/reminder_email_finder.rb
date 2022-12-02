# frozen_string_literal: true

class ReminderEmailFinder
  attr_reader :enrollment

  def initialize(enrollments)
    @enrollments = enrollments
  end

  def call(enrollments)
    draft_enrollments(enrollments)
  end

  def draft_enrollments(enrollments)
    Enrollment.where(status: "draft")
      .where({updated_at: (Time.now.midnight - 1.months)..Time.now.midnight - 15.days})
  end
  #       .where("enrollments.updated_at > ?", (Time.now.midnight - 15.days) && (Time.now.midnight - 3.months))
  # Enrollment.where(status: "draft").where({ updated_at: (Time.now.midnight - 3.months)..Time.now.midnight - 15.days})

  def draft_enrollments_update_events_without_diff(enrollments)
    enrollments = draft_enrollments(enrollments)
    enrollments.joins(:events)
      .where({events: {name: "update", diff: nil}})
  end

  def draft_enrollments_update_events_with_diff(enrollments)
    enrollments = draft_enrollments(enrollments)
    enrollments.joins(:events)
      .where({events: {name: "update"}}.select { |e| e.diff.present? })

    # draft_enrollments_with_diff.each do |enrollment|
    #   enrollment.events.select { |e| e.name == "update" && e.diff.present? }
    # end
  end

  # Check that enrollment has an event "update" and a reminder event
  # If not send email
  # if Event update has a diff and not event "reminder"
  # send email
  # if event update has a diff < 3 and event "reminder"
  # send email
end
