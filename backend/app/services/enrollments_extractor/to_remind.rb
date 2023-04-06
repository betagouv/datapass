# frozen_string_literal: true

class EnrollmentsExtractor::ToRemind < AbstractEnrollmentsExtractor
  def extract_from_date
    Time.new(2022, 7, 1)
  end

  def extract_criteria
    {
      statuses: %w[draft],
      included_event_names: %w[create update archive copy reminder],
      most_recent_event_names: %w[create update archive copy],
      time_since_most_recent_event: 15.days
    }
  end
end
