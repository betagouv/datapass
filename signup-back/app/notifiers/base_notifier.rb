class BaseNotifier < AbstractNotifier
  include EmailNotifierMethods

  def create(user_id:)
    deliver_created_mail_to_enrollment_creator
  end

  def update(user_id:, diff:)
  end

  def team_member_update(team_member_type:)
    if team_member_type.in?(%w[delegue_protection_donnees responsable_traitement])
      deliver_rgpd_email_for(team_member_type)
    end
  end

  def submit(user_id:, comment:)
    deliver_event_mailer(__method__, comment)

    notify_subscribers_by_email_for_submitted_enrollment
  end

  def notify(user_id:, comment:)
    deliver_event_mailer(__method__, comment)
  end

  def request_changes(user_id:, comment:)
    deliver_event_mailer(__method__, comment)
  end

  def refuse(user_id:, comment:)
    deliver_event_mailer(__method__, comment)
  end

  def validate(user_id:, comment:)
    deliver_event_mailer(__method__, comment)

    if enrollment.team_members.exists?(type: "responsable_traitement")
      deliver_rgpd_email_for("responsable_traitement")
    end

    if enrollment.team_members.exists?(type: "delegue_protection_donnees")
      deliver_rgpd_email_for("delegue_protection_donnees")
    end
  end
end
