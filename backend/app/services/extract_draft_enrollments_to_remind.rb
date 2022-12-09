# frozen_string_literal: true

class ExtractDraftEnrollmentsToRemind
  attr_reader :enrollment

  def call
    if created_at_updated_at_last_events?
      created_at_updated_at_last_events_ids =
        draft_enrollments_with_last_update_or_create_events.pluck(:enrollment_id).flatten
      Enrollment.find(created_at_updated_at_last_events_ids)
    end
  end

  def draft_enrollments
    Enrollment.where(status: "draft")
      .where({updated_at: (Time.new(2022, 11, 1).beginning_of_day)..Time.now.end_of_day - 15.days})
      .includes(:events)
      .where.not({events: {name: %w[notify]}})
      .order(:id, "events.created_at")
  end

  def draft_enrollments_with_last_update_or_create_events
    enrollments = draft_enrollments
    events = enrollments.map { |enrollment| enrollment.events.last }.to_a
    events.reject { |event| event.name == "reminder" }
  end

  def created_at_updated_at_last_events?
    draft_enrollments_with_last_update_or_create_events.any?
  end
end
