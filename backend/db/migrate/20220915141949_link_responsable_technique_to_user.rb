class LinkResponsableTechniqueToUser < ActiveRecord::Migration[7.0]
  def up
    TeamMember.where(type: 'responsable_technique').each do |team_member|
      team_member.user = if team_member.email.present?
        User.reconcile({"email" => team_member.email})
      end
      team_member.save!
    end
  end

  def down
    TeamMember.where(type: 'responsable_technique').each do |team_member|
      team_member.user = nil
      team_member.save!
    end
  end
end
