class GetAverageProcessingTimeInDays < ApplicationService
  def initialize(target_api)
    @filter_by_target_api_criteria = target_api ?
      "target_api = '#{ActiveRecord::Base.connection.quote_string(target_api)}'" :
      "1 = 1" # equivalent to no filter
  end

  # Temps moyen de traitement des demandes
  def call
    query = <<-SQL
      WITH events_last_submit as (
        SELECT DISTINCT ON (enrollment_id) *
        FROM events WHERE name = 'submitted' ORDER BY enrollment_id, created_at DESC
      )
      SELECT TO_CHAR(
        AVG (validation_duration),
        'FM999999999'
      )
      FROM (
        SELECT
          enrollments.id, events_stop.created_at AS done_at, events_last_submit.created_at AS submitted_at,
          DATE_PART('days', events_stop.created_at - events_last_submit.created_at) AS validation_duration
        FROM enrollments
        INNER JOIN
          events AS events_stop ON events_stop.enrollment_id = enrollments.id
          AND events_stop.name IN ('validated', 'refused')
        INNER JOIN
          events_last_submit ON events_last_submit.enrollment_id = enrollments.id
        WHERE status IN ('validated', 'refused')
        AND events_stop.created_at > CURRENT_DATE - INTERVAL '6 months'
        AND #{@filter_by_target_api_criteria}
      ) e;
    SQL

    ActiveRecord::Base
      .connection
      .execute(query)
      .getvalue(0, 0)
  end
end
