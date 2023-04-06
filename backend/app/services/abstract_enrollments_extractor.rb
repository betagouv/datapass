# frozen_string_literal: true

class AbstractEnrollmentsExtractor
  def extract_from_date
    fail NotImplementedError
  end

  def extract_criteria
    fail NotImplementedError
  end

  def call
    filter_enrollments
  end

  def query_enrollments
    Enrollment.where(status: extract_criteria[:statuses])
      .includes(:events)
      .where({
        events: {
          name: extract_criteria[:included_event_names],
          created_at: extract_from_date.beginning_of_day...Time.now
        }
      })
  end

  def filter_enrollments
    enrollments = query_enrollments
    most_recent_event_of_each_enrollment = enrollments.lazy.map do |enrollment|
      sorted_events = enrollment.events.sort_by(&:created_at)
      sorted_events.last
    end

    enrollment_ids = most_recent_event_of_each_enrollment
      .to_a
      .select do |event|
      extract_criteria[:most_recent_event_names].include?(event.name) &&
        (
          !extract_criteria[:time_since_most_recent_event] ||
          event.created_at.between?(
            extract_from_date.beginning_of_day,
            extract_criteria[:time_since_most_recent_event].ago.end_of_day
          )
        )
    end
      .pluck(:enrollment_id)

    Enrollment.find(enrollment_ids)
  end
end
