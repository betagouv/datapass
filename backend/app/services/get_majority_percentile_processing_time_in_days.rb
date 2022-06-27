class GetMajorityPercentileProcessingTimeInDays < ApplicationService
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
        percentile_cont(0.8) WITHIN GROUP (ORDER BY validation_duration ASC),
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

    majority_percentile_processing_time_in_days = ActiveRecord::Base
      .connection
      .execute(query)
      .getvalue(0, 0)

    # Si aucune demandes traitées, on affiche un temps moyen de 3 semaines
    if majority_percentile_processing_time_in_days.nil?
      majority_percentile_processing_time_in_days = "21"
    end

    # Temps moyen de traitement des demandes d’habilitation n'exclu pas les Week end
    # On préfère afficher 3 jours minimum pour éviter d'afficher un temps de traitement trop court.
    if majority_percentile_processing_time_in_days.to_i < 3
      majority_percentile_processing_time_in_days = "3"
    end

    majority_percentile_processing_time_in_days
  end
end
