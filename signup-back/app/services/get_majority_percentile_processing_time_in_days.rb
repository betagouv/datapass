class GetMajorityPercentileProcessingTimeInDays < ApplicationService
  def initialize(target_api)
    @filter_by_target_api_criteria = target_api ?
      "target_api = '#{ActiveRecord::Base.connection.quote_string(target_api)}'" :
      "1 = 1" # equivalent to no filter
  end

  # Temps moyen de traitement des demandes
  def call
    query = <<-SQL
      WITH events_first_submit as (
        SELECT DISTINCT ON (enrollment_id) *
        FROM events WHERE name = 'submitted' ORDER BY enrollment_id, created_at DESC
      )
      SELECT TO_CHAR(
        percentile_cont(0.8) WITHIN GROUP (ORDER BY validation_duration ASC),
        'FM999999999'
      )
      FROM (
        SELECT
          enrollments.id, events_stop.created_at AS done_at, events_first_submit.created_at AS submitted_at,
          DATE_PART('days', events_stop.created_at - events_first_submit.created_at) AS validation_duration
        FROM enrollments
        INNER JOIN
          events AS events_stop ON events_stop.enrollment_id = enrollments.id
          AND events_stop.name IN ('validated', 'refused')
        INNER JOIN
          events_first_submit ON events_first_submit.enrollment_id = enrollments.id
        WHERE status IN ('validated', 'refused')
        AND events_stop.created_at > CURRENT_DATE - INTERVAL '6 months'
        AND #{@filter_by_target_api_criteria}
      ) e;
    SQL

    majority_percentile_processing_time_in_days = ActiveRecord::Base
      .connection
      .execute(query)
      .getvalue(0, 0)

    if majority_percentile_processing_time_in_days.nil?
      majority_percentile_processing_time_in_days = "21"
    end

    if majority_percentile_processing_time_in_days.to_i < 3
      majority_percentile_processing_time_in_days = "3"
    end

    majority_percentile_processing_time_in_days
  end
end
