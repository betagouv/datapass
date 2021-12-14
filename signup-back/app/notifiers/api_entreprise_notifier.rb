class ApiEntrepriseNotifier < AbstractNotifier
  include WebhookNotifierMethods
  include EmailNotifierMethods

  def create(user_id:)
    deliver_event_webhook(__method__)
  end

  def update(user_id:, diff:)
    deliver_event_webhook(__method__)
  end

  def team_member_update(team_member_type:)
    if team_member_type.in?(%w[delegue_protection_donnees responsable_traitement])
      deliver_rgpd_email_for(team_member_type)
    end
  end

  def submit(user_id:, comment:)
    deliver_event_webhook(__method__)

    notify_subscribers_by_email_for_submitted_enrollment
  end

  def notify(user_id:, comment:)
    deliver_event_webhook(__method__)
  end

  def request_changes(user_id:, comment:)
    deliver_event_webhook(__method__)
  end

  def refuse(user_id:, comment:)
    deliver_event_webhook(__method__)
  end

  def validate(user_id:, comment:)
    deliver_event_webhook(__method__)

    if enrollment.team_members.exists?(type: "responsable_traitement")
      deliver_rgpd_email_for("responsable_traitement")
    end

    if enrollment.team_members.exists?(type: "delegue_protection_donnees")
      deliver_rgpd_email_for("delegue_protection_donnees")
    end
  end
end
