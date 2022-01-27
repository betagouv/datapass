class MigrateHubeePortailScopes < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE enrollments
          SET scopes = jsonb_build_object('CERTDC', scopes->>'cert_dc')
          WHERE target_api = 'hubee_portail'
            AND scopes ? 'cert_dc';
        SQL
      end

      dir.down do
        execute <<-SQL
          UPDATE enrollments
          SET scopes = jsonb_build_object('cert_dc', scopes->>'CERTDC')
          WHERE target_api = 'hubee_portail'
            AND scopes ? 'CERTDC';
        SQL
      end
    end
  end
end
