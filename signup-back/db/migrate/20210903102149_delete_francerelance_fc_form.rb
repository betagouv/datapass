class DeleteFrancerelanceFcForm < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE enrollments
          SET
            dpo_is_informed = true,
            target_api = 'franceconnect'
          WHERE target_api = 'francerelance_fc';
        SQL
      end
      dir.down do
        raise ActiveRecord::IrreversibleMigration
      end
    end
  end
end
