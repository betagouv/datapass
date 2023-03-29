# frozen_string_literal: true

class EnrollmentsExtractor
  def initialize(extract_from_date, extract_criteria)
    @extract_from_date = extract_from_date
    @extract_criteria = extract_criteria
  end

  def call
    enrollments_to_archive
  end

  def preselect_enrollments_to_archive
    Enrollment.where(status: @extract_criteria.statuses)
      .includes(:events)
      .where({
         events: {
           name: @extract_criteria.included_event_names,
           created_at: @extract_from_date.beginning_of_day...Time.now
         }
       })
  end

  def enrollments_to_archive
    preselected_enrollments = preselect_enrollments_to_archive
    last_enrollments_event = preselected_enrollments.lazy.map do |enrollment|
      sorted_events = enrollment.events.sort_by(&:created_at)
      sorted_events.last
    end

    enrollment_ids = last_enrollments_event
        .to_a
        .select do |event|
          event.name.in? @extract_criteria.most_recent_event_names &&
           (
             !@extract_criteria.days_since_most_recent_event ||
             event.created_at.between?(
               @extract_from_date.beginning_of_day,
               @extract_criteria.time_since_most_recent_event.ago.end_of_day
             )
           )
          end
        .pluck(:enrollment_id)

    Enrollment.find(enrollment_ids)
  end
end
