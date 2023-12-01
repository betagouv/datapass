class AbstractEntreculierNotifier < AbstractNotifier
  include WebhookNotifierMethods
  include EmailNotifierMethods

  def validate(*)
    deliver_event_webhook(__method__)

    deliver_rgpd_email_for("responsable_traitement") if enrollment.team_members.exists?(type: "responsable_traitement")

    RegisterOrganizationWithContactsOnHubspotWorker.perform_async(enrollment.id)

    return unless enrollment.team_members.exists?(type: "delegue_protection_donnees")

    deliver_rgpd_email_for("delegue_protection_donnees")
  end

  def create
    deliver_event_webhook(__method__)
  end

  def update(*)
    deliver_event_webhook(__method__)
  end

  def team_member_update(team_member_type:)
    return unless team_member_type.in?(%w[delegue_protection_donnees responsable_traitement])

    deliver_rgpd_email_for(team_member_type)
  end

  def submit(*)
    deliver_event_webhook(__method__)
  end

  def notify(*)
    deliver_event_webhook(__method__)
  end

  def request_changes(*)
    deliver_event_webhook(__method__)
  end

  def refuse(*)
    deliver_event_webhook(__method__)
  end

  def revoke(*)
    deliver_event_webhook(__method__)
  end

  def delete
    deliver_event_webhook(__method__)
  end

  def archive
    deliver_event_webhook(__method__)
  end
end
