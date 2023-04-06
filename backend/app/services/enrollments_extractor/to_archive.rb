class EnrollmentsExtractor::ToArchive < AbstractEnrollmentsExtractor
  def initialize
    super(
      Time.new(2022, 9, 1),
      {
        statuses: %w[changes_requested],
        included_event_names: %w[reminder_before_archive update archive],
        most_recent_event_names: %w[reminder_before_archive],
        time_since_most_recent_event: 15.days
      }
    )
  end
end
