class ApiEntrepriseNotifier < AbstractNotifier
  include WebhookNotifierMethods
  include EmailNotifierMethods

  def create
    deliver_event_webhook(__method__)
  end

  def update(diff:, user_id:)
    deliver_event_webhook(__method__)
  end

  def team_member_update(team_member_type:)
    if team_member_type.in?(%w[delegue_protection_donnees responsable_traitement])
      deliver_rgpd_email_for(team_member_type)
    end
  end

  def submit(comment:, current_user:)
    deliver_event_webhook(__method__)
  end

  def notify(comment:, current_user:)
    deliver_event_webhook(__method__)
  end

  def request_changes(comment:, current_user:)
    deliver_event_webhook(__method__)
  end

  def refuse(comment:, current_user:)
    deliver_event_webhook(__method__)
  end

  def validate(comment:, current_user:)
    deliver_event_webhook(__method__)

    if enrollment.team_members.exists?(type: "responsable_traitement")
      deliver_rgpd_email_for("responsable_traitement")
    end

    if enrollment.team_members.exists?(type: "delegue_protection_donnees")
      deliver_rgpd_email_for("delegue_protection_donnees")
    end
  end

  def delete
    deliver_event_webhook(__method__)
  end
end
