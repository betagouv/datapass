class UpgradeHubeeForm < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE enrollments
          SET target_api = 'hubee_portail'
          WHERE target_api = 'hubee';
        SQL

        # check new checkbox dpo_is_informed if cgu_approved is checked
        execute <<-SQL
          UPDATE enrollments
          SET dpo_is_informed = TRUE
          WHERE cgu_approved = TRUE
            AND target_api = ANY(ARRAY['hubee_portail']);
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET scopes = jsonb_build_object('cert_dc', true)
          WHERE demarche = 'exemple' AND target_api = 'hubee_portail';
        SQL

        execute <<-SQL
          UPDATE team_members tm2
          SET
            type = 'responsable_metier'
          FROM (
                   SELECT
                       tm.id
                   FROM enrollments e
                   LEFT JOIN team_members tm on tm.enrollment_id = e.id and tm.type = 'contact_metier'
                   WHERE target_api = 'hubee_portail'
               ) AS subquery
          WHERE tm2.id = subquery.id;
        SQL
      end

      execute <<-SQL
        UPDATE enrollments
        SET
          intitule = 'Abonnement au portail HubEE',
          description = null,
          fondement_juridique_title = null,
          fondement_juridique_url = null,
          demarche = null
        WHERE target_api = 'hubee_portail';
      SQL

      dir.down do
        execute <<-SQL
          UPDATE enrollments
          SET target_api = 'hubee'
          WHERE target_api = 'hubee_portail';
        SQL
      end
    end
  end
end
