class HubeeScopesToBoolean < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE enrollments
          SET scopes = jsonb_build_object('CERTDC', true)
          WHERE target_api = 'hubee_portail'
            AND scopes->'CERTDC' = to_jsonb('true'::text);
        SQL
        execute <<-SQL
          UPDATE enrollments
          SET scopes = jsonb_build_object('CERTDC', false)
          WHERE target_api = 'hubee_portail'
            AND scopes->'CERTDC' = to_jsonb('false'::text);
        SQL
      end

      dir.down do
      end
    end
  end
end
