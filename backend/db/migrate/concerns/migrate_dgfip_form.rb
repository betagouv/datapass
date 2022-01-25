module MigrateDgfipForm
  def move_production_data_to_sandbox(data_providers_prefix = [])
    full_data_providers = data_providers_prefix
      .map { |prefix| %W[#{prefix}_sandbox #{prefix}_production] }
      .flatten
      .map { |data_provider| "'#{data_provider}'" }.join(",")
    production_data_providers = data_providers_prefix
      .map { |prefix| "#{prefix}_production" }
      .map { |data_provider| "'#{data_provider}'" }.join(",")

    # check new checkbox dpo_is_informed if cgu_approved is checked
    execute <<-SQL
          UPDATE enrollments
          SET dpo_is_informed = TRUE
          WHERE cgu_approved = TRUE
            AND target_api = ANY(ARRAY[#{full_data_providers}]);
    SQL

    # move data from production from to sandbox form

    # in case there is 2 production forms for one sandbox form
    # we must take the last gdpr contact from each type and remove the previous one

    # see https://stackoverflow.com/questions/25170215/get-values-from-first-and-last-row-per-group#answer-25173081
    execute <<-SQL
          CREATE OR REPLACE FUNCTION public.last_agg (anyelement, anyelement)
            RETURNS anyelement
            LANGUAGE sql IMMUTABLE STRICT AS
          'SELECT $2';
          CREATE AGGREGATE public.last(anyelement) (
            SFUNC = public.last_agg
          , STYPE = anyelement
          );
    SQL

    execute <<-SQL
          UPDATE team_members
          SET enrollment_id = subquery.previous_enrollment_id
          FROM (
              SELECT previous_enrollment_id, last(id) as id
              FROM (
                 SELECT e.previous_enrollment_id, tm.id
                 FROM enrollments e
                          LEFT JOIN team_members tm ON tm.enrollment_id = e.id
                              AND tm.type = 'responsable_traitement'
                 WHERE e.target_api = ANY(ARRAY[#{production_data_providers}])
                 ORDER BY e.id
              ) AS subsubquery
              GROUP BY previous_enrollment_id
          ) AS subquery
          WHERE subquery.id = team_members.id;
    SQL
    execute <<-SQL
          UPDATE team_members
          SET enrollment_id = subquery.previous_enrollment_id
          FROM (
              SELECT previous_enrollment_id, last(id) as id
              FROM (
                 SELECT e.previous_enrollment_id, tm.id
                 FROM enrollments e
                          LEFT JOIN team_members tm ON tm.enrollment_id = e.id
                              AND tm.type = 'delegue_protection_donnees'
                 WHERE e.target_api = ANY(ARRAY[#{production_data_providers}])
                 ORDER BY e.id
              ) AS subsubquery
              GROUP BY previous_enrollment_id
          ) AS subquery
          WHERE subquery.id = team_members.id;
    SQL
    execute <<-SQL
          DELETE FROM team_members
          WHERE id IN (
          SELECT tm.id
            FROM enrollments e
              LEFT JOIN team_members tm ON tm.enrollment_id = e.id
                  AND tm.type = ANY(ARRAY['responsable_traitement','delegue_protection_donnees'])
            WHERE e.target_api = ANY(ARRAY[#{production_data_providers}])
          );
    SQL

    execute <<-SQL
          DROP AGGREGATE public.last(anyelement);
          DROP FUNCTION public.last_agg (anyelement, anyelement);
    SQL
    execute <<-SQL
          UPDATE enrollments
          SET
            data_retention_period = subquery.data_retention_period,
            data_recipients = subquery.data_recipients,
            data_retention_comment = subquery.data_retention_comment
          FROM (
                   SELECT
                       previous_enrollment_id,
                       data_retention_period,
                       data_recipients,
                       data_retention_comment
                   FROM enrollments
                   WHERE target_api = ANY(ARRAY[#{production_data_providers}])
                   ORDER BY id
               ) AS subquery
          WHERE id = subquery.previous_enrollment_id;
    SQL
  end

  def move_access_mode_to_additional_content(data_provider, access_mode)
    execute <<-SQL
      UPDATE enrollments
      SET additional_content = additional_content
          || jsonb_build_object('#{access_mode}', (scopes ->> 'dgfip_#{access_mode}')::boolean),
          scopes             = scopes - 'dgfip_#{access_mode}'
      WHERE target_api = '#{data_provider}';
    SQL
  end
end
