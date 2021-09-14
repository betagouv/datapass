class ApiEntrepriseNotifier < AbstractNotifier
  include WebhookNotifierMethods
  include EmailNotifierMethods

  def created
    deliver_event_webhook(__method__)
  end

  def updated(diff:, user_id:)
    deliver_event_webhook(__method__)
  end

  def team_member_updated(team_member_type:)
    if team_member_type.in?(%w[delegue_protection_donnees responsable_traitement])
      deliver_rgpd_email_for(team_member_type)
    end
  end

  def send_application(comment:, current_user:)
    deliver_event_webhook(__method__)

    notify_subscribers_by_email_for_sent_application
  end

  def notify(comment:, current_user:)
    deliver_event_webhook(__method__)
  end

  def review_application(comment:, current_user:)
    deliver_event_webhook(__method__)
  end

  def refuse_application(comment:, current_user:)
    deliver_event_webhook(__method__)
  end

  def validate_application(comment:, current_user:)
    deliver_event_webhook(__method__)

    if enrollment.team_members.exists?(type: "responsable_traitement")
      deliver_rgpd_email_for("responsable_traitement")
    end

    if enrollment.team_members.exists?(type: "delegue_protection_donnees")
      deliver_rgpd_email_for("delegue_protection_donnees")
    end
  end
end
