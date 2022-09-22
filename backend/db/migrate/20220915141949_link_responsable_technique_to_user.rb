class LinkResponsableTechniqueToUser < ActiveRecord::Migration[7.0]
  def up
    TeamMember.where(type: "responsable_technique").each do |team_member|
      if team_member.email.present? && team_member.email.match(URI::MailTo::EMAIL_REGEXP)
        team_member.user = User.reconcile({"email" => team_member.email})
        team_member.save!
      end
    end
  end

  def down
    TeamMember.where(type: "responsable_technique").each do |team_member|
      team_member.user = nil
      team_member.save!
    end
  end
end
