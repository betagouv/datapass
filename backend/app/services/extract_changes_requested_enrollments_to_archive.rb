# frozen_string_literal: true

class ExtractChangesRequestedEnrollmentsToArchive
  attr_reader :enrollment

  OLDEST_CHANGES_REQUESTED_ENROLLMENTS = Time.now.beginning_of_day - 9.months

  def call
    last_request_changes_or_update_events = last_request_changes_or_update_events_for_enrollments
    enrollment_ids = last_request_changes_or_update_events.pluck(:enrollment_id)
    Enrollment.find(enrollment_ids)
  end

  def changes_requested_enrollments
    Enrollment.where(status: "changes_requested")
      .where({updated_at: OLDEST_CHANGES_REQUESTED_ENROLLMENTS...Time.now.ago(6.months).beginning_of_day})
      .includes(:events)
      .where({events: {name: %w[request_changes update reminder]}})
      .order(:id, "events.created_at")
  end

  def last_request_changes_or_update_events_for_enrollments
    enrollments = changes_requested_enrollments
    events = enrollments.map { |enrollment| enrollment.events.last }.to_a
    events.reject { |event| event.name == "reminder" }
  end
end
