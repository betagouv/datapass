# frozen_string_literal: true

class AbstractEnrollmentsExtractor
  def extract_from_date
    fail NotImplementedError
  end

  def extract_criteria
    fail NotImplementedError
  end

  def call
    enrollments = query_enrollments
    filter_enrollments(enrollments)
  end

  def query_enrollments
    Enrollment
      .where(status: extract_criteria[:statuses])
      .where.not(target_api: Enrollment.migrated_target_apis)
      .includes(:events)
      .where({
        events: {
          name: extract_criteria[:included_event_names],
          created_at: extract_from_date.beginning_of_day...Time.now
        }
      })
  end

  def map_enrollments_to_last_events(enrollments)
    enrollments.map do |enrollment|
      sorted_events = enrollment.events.sort_by(&:created_at)
      sorted_events.last
    end
  end

  def filter_events_by_extract_criteria(events)
    events.select do |event|
      extract_criteria[:most_recent_event_names].include?(event.name) &&
        (
          !extract_criteria[:time_since_most_recent_event] ||
            event.created_at.between?(
              extract_from_date.beginning_of_day,
              extract_criteria[:time_since_most_recent_event].ago.end_of_day
            )
        )
    end
  end

  def filter_enrollments(enrollments)
    enrollments_last_events = map_enrollments_to_last_events(enrollments)
    filtered_last_events_by_extract_criteria = filter_events_by_extract_criteria(enrollments_last_events)
    enrollments_ids = filtered_last_events_by_extract_criteria.pluck(:enrollment_id)
    Enrollment.find(enrollments_ids)
  end
end
