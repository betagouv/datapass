# frozen_string_literal: true

class ArchiveEnrollments
  attr_reader :enrollment

  REMIND_FROM_DATE = Time.new(2022, 9, 1)

  def call
    enrollments_to_archive
  end

  def select_enrollments_to_archive
    Enrollment.where(status: %w[draft changes_requested])
      .where({updated_at: REMIND_FROM_DATE.beginning_of_day...16.days.ago.end_of_day})
      .includes(:events)
      .where({events: {name: %w[reminder update]}})
      .order(:id, "events.created_at")
  end

  def enrollments_to_archive
    enrollments = select_enrollments_to_archive
    enrollment_ids = enrollments.lazy.map { |enrollment| enrollment.events.last }.to_a
      .select { |event| event.name == "reminder" }
      .pluck(:enrollment_id)

    Enrollment.find(enrollment_ids)
  end
end
