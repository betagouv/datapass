# frozen_string_literal: true

class EnrollmentsExtractor::ToRemindBeforeArchive < AbstractEnrollmentsExtractor
  def extract_from_date
    Time.new(2022, 5, 1)
  end

  def extract_criteria
    {
      statuses: %w[changes_requested],
      included_event_names: %w[request_changes update reminder_before_archive archive],
      most_recent_event_names: %w[request_changes update],
      time_since_most_recent_event: 6.months
    }
  end
end
