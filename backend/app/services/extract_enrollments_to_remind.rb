# frozen_string_literal: true

class ExtractEnrollmentsToRemind < EnrollmentsExtractor
  def initialize
    super(
      Time.new(2022, 7, 1),
      {
        statuses: %w[draft],
        included_event_names: %w[create update archive copy reminder],
        most_recent_event_names: %w[create update archive copy],
        time_since_most_recent_event: 15.days
      }
    )
  end
end
