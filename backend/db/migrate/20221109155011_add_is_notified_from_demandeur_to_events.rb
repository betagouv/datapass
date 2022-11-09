class AddIsNotifiedFromDemandeurToEvents < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        add_column :events, :is_notified_from_demandeur, :boolean, default: false
        notify_events = select_all("SELECT * FROM events WHERE name='notify'")
        notify_events.each do |event|
          team_member = select_one("SELECT * FROM team_members WHERE user_id=#{event['user_id']} AND type='demandeur'")
          if team_member
            update("UPDATE events SET is_notified_from_demandeur=TRUE WHERE id=#{event['id']}")
          end
        end
      end

      dir.down do
        remove_column :events, :is_notified_from_demandeur
      end
    end
  end
end

