# frozen_string_literal: true

class SendReminderEnrollments
  attr_reader :enrollment

  REMIND_FROM_DATE = Time.new(2022, 7, 1)

  def call
    last_update_or_create_events = last_update_or_create_events_enrollments
    enrollment_ids = last_update_or_create_events.pluck(:enrollment_id)
    Enrollment.find(enrollment_ids)
  end

  def preselect_enrollments
    Enrollment.where(status: "draft")
      .where({updated_at: (REMIND_FROM_DATE.beginning_of_day)..Time.now.end_of_day - 15.days})
      .includes(:events)
      .where.not({events: {name: %w[notify]}})
      .order(:id, "events.created_at")
  end

  def last_update_or_create_events_enrollments
    enrollments = preselect_enrollments
    events = enrollments.map { |enrollment| enrollment.events.last }.to_a
    events.reject { |event| event.name == "reminder" }
  end
end
