# frozen_string_literal: true

class ArchiveAfterReminderEnrollments
  REMIND_FROM_DATE = Time.new(2022, 9, 1)

  def call
    enrollments_to_archive
  end

  def preselect_enrollments_to_archive
    Enrollment.where(status: "changes_requested")
      .includes(:events)
      .where({events: {name: %w[reminder_before_archive update], created_at: REMIND_FROM_DATE.beginning_of_day...Time.now}})
  end

  def enrollments_to_archive
    preselected_enrollments = preselect_enrollments_to_archive
    last_enrollments_event = preselected_enrollments.lazy.map do |enrollment|
      sorted_events = enrollment.events.sort_by(&:created_at)
      sorted_events.last
    end

    enrollment_ids = last_enrollments_event.to_a
      .select { |event| event.name == "reminder_before_archive" && event.created_at.between?(REMIND_FROM_DATE.beginning_of_day, 16.days.ago.end_of_day) }
      .pluck(:enrollment_id)

    Enrollment.find(enrollment_ids)
  end
end
