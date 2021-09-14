class BaseNotifier < AbstractNotifier
  include EmailNotifierMethods

  def created
    deliver_created_mail_to_enrollment_creator
  end

  def updated(diff:, user_id:)
  end

  def team_member_updated(team_member_type:)
    if team_member_type.in?(%w[delegue_protection_donnees responsable_traitement])
      deliver_rgpd_email_for(team_member_type)
    end
  end

  def send_application(comment:, current_user:)
    deliver_event_mailer(__method__, comment)

    notify_subscribers_by_email_for_sent_application
  end

  def notify(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end

  def review_application(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end

  def refuse_application(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end

  def validate_application(comment:, current_user:)
    deliver_event_mailer(__method__, comment)

    if enrollment.team_members.exists?(type: "responsable_traitement")
      deliver_rgpd_email_for("responsable_traitement")
    end

    if enrollment.team_members.exists?(type: "delegue_protection_donnees")
      deliver_rgpd_email_for("delegue_protection_donnees")
    end
  end
end
