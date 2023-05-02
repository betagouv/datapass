class RemoveValidatedEnrollmentsUnprocessedMessages < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE events
          SET processed_at = '#{Time.zone.now.to_s(:db)}'
          WHERE id IN (
            SELECT events.id
            FROM events
            JOIN enrollments ON enrollments.id = events.enrollment_id
            WHERE enrollments.status = 'validated' AND events.name = 'notify' AND processed_at IS NULL
          )
        SQL
      end
      dir.down do
      end
    end
  end
end
