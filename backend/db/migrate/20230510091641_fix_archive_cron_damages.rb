class FixArchiveCronDamages < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      cron_archived_enrollments = Enrollment.joins(:events).where({
        events: {user_id: nil, name: "archive", created_at: ..DateTime.new(2023, 3, 20)}
      }).distinct

      cron_archived_enrollments.each do |enrollment|
        # Reatribute previous status name
        enrollment_events_names = enrollment.events.pluck(:name)
        enrollment.status = if enrollment_events_names.include?("request_changes")
          "changes_requested"
        else
          "draft"
        end

        # Delete wrong archive event
        enrollment.events.find_by(name: "archive")&.destroy

        enrollment.save!
      end

      dir.down do
      end
    end
  end
end
