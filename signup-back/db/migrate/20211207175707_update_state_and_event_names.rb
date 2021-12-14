class UpdateStateAndEventNames < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE events
          SET name = CASE name
            WHEN 'created' THEN 'create'
            WHEN 'updated_contacts' THEN 'update_contacts'
            WHEN 'updated' THEN 'update'
            WHEN 'asked_for_modification' THEN 'request_changes'
            WHEN 'notified' THEN 'notify'
            WHEN 'submitted' THEN 'submit'
            WHEN 'imported' THEN 'import'
            WHEN 'validated' THEN 'validate'
            WHEN 'copied' THEN 'copy'
            WHEN 'refused' THEN 'refuse'
            ELSE name
          END;
        SQL
        execute <<-SQL
          UPDATE enrollments
          SET status = CASE status
            WHEN 'pending' THEN 'draft'
            WHEN 'modification_pending' THEN 'changes_requested'
            WHEN 'sent' THEN 'submitted'
            WHEN 'validated' THEN 'validated'
            WHEN 'refused' THEN 'refused'
            ELSE status
          END;
        SQL
      end

      dir.down do
        execute <<-SQL
          UPDATE events
          SET name = CASE name
            WHEN 'create' THEN 'created'
            WHEN 'update_contacts' THEN 'updated_contacts'
            WHEN 'update' THEN 'updated'
            WHEN 'request_changes' THEN 'asked_for_modification'
            WHEN 'notify' THEN 'notified'
            WHEN 'submit' THEN 'submitted'
            WHEN 'import' THEN 'imported'
            WHEN 'validate' THEN 'validated'
            WHEN 'copy' THEN 'copied'
            WHEN 'refuse' THEN 'refused'
            ELSE name
          END;
        SQL
        execute <<-SQL
          UPDATE enrollments
          SET status = CASE status
            WHEN 'draft' THEN 'pending'
            WHEN 'changes_requested' THEN 'modification_pending'
            WHEN 'submitted' THEN 'sent'
            WHEN 'validated' THEN 'validated'
            WHEN 'refused' THEN 'refused'
            ELSE status
          END;
        SQL
      end
    end
  end
end
