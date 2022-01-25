class UpgradeApiIndemnitesJournalieresCnam < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        # check new checkbox dpo_is_informed if cgu_approved is checked
        execute <<-SQL
          UPDATE enrollments
          SET dpo_is_informed = TRUE
          WHERE cgu_approved = TRUE
            AND target_api = ANY(ARRAY['api_indemnites_journalieres_cnam']);
        SQL
      end

      dir.down do
      end
    end
  end
end
