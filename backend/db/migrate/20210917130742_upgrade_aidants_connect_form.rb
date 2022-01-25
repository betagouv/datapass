class UpgradeAidantsConnectForm < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        # check new checkbox dpo_is_informed if cgu_approved is checked
        execute <<-SQL
          UPDATE enrollments
          SET dpo_is_informed = TRUE
          WHERE cgu_approved = TRUE
            AND target_api = ANY(ARRAY['aidants_connect']);
        SQL

        execute <<-SQL
          UPDATE enrollments
          SET
            type_projet = additional_content->>'organization_type',
            volumetrie_approximative = CONCAT(additional_content->>'demandes_par_semaines', ' par semaine'),
            additional_content = additional_content #- '{organization_type}' #- '{demandes_par_semaines}'
          WHERE target_api = 'aidants_connect';
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
                   WHERE target_api = 'aidants_connect'
               ) AS subquery
          WHERE tm2.id = subquery.id;
        SQL
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
