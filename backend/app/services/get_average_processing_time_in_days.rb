class GetAverageProcessingTimeInDays < ApplicationService
  def initialize(target_api)
    @filter_by_target_api_criteria = target_api ?
      "target_api = '#{ActiveRecord::Base.connection.quote_string(target_api)}'" :
      "1 = 1" # equivalent to no filter
  end

  # Temps moyen de traitement des demandes d’habilitation
  def call
    query = <<-SQL
      WITH selected_enrollments as (
        SELECT id
        FROM enrollments
        WHERE status IN ('validated', 'refused')
          AND updated_at > CURRENT_DATE - INTERVAL '6 months'
          AND #{@filter_by_target_api_criteria}
      )
      SELECT TO_CHAR(
        AVG (validation_duration),
        'FM999999999'
      )
      FROM (
        SELECT enrollment_id,
          DATE_PART(
            'days',
            MIN(created_at) FILTER (WHERE name IN ('request_changes', 'validate', 'refuse')) -
            MIN(created_at) FILTER (WHERE name IN ('submit'))
          ) AS validation_duration
        FROM events
          INNER JOIN
            selected_enrollments ON enrollment_id = selected_enrollments.id
        GROUP BY enrollment_id
      ) e;
    SQL

    ActiveRecord::Base
      .connection
      .execute(query)
      .getvalue(0, 0)
  end
end
