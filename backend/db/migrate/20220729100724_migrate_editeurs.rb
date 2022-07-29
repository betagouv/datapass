class MigrateEditeurs < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        # replace all variations of JVS-Mairistem
        execute <<-SQL
          UPDATE enrollments
          SET technical_team_value = '32855218700069'
          WHERE target_api = 'api_particulier'
            AND lower(technical_team_value) like '%jvs%';
        SQL
        # replace all variations of Kosmos
        execute <<-SQL
          UPDATE enrollments
          SET technical_team_value = '41922342500044'
          WHERE target_api = 'api_particulier'
            AND lower(technical_team_value) like '%kosmos%';
        SQL
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
