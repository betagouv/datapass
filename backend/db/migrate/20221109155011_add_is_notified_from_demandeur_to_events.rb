class AddIsNotifiedFromDemandeurToEvents < ActiveRecord::Migration[7.0]
  def change
    reversible do |dir|
      dir.up do
        add_column :events, :is_notify_from_demandeur, :boolean, default: false
        Event.where(name: 'notify').each do |event|
          team_member = select_one("SELECT * FROM team_members WHERE enrollment_id=#{event["enrollment_id"]} AND user_id=#{event["user_id"]} AND type='demandeur'")
          if team_member
            update("UPDATE events SET is_notify_from_demandeur=TRUE WHERE id=#{event["id"]}")
          end
        end
      end

      dir.down do
        remove_column :events, :is_notify_from_demandeur
      end
    end
  end
end
