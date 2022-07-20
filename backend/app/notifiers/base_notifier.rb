# frozen_string_literal: true

class BaseNotifier < AbstractNotifier
  include EmailNotifierMethods

  def create
    deliver_created_mail_to_enrollment_creator
  end

  def update(diff:, user_id:)
  end

  def team_member_update(team_member_type:)
    if team_member_type.in?(%w[delegue_protection_donnees responsable_traitement])
      deliver_rgpd_email_for(team_member_type)
    end
  end

  def submit(comment:, current_user:)
    deliver_event_mailer(__method__, comment)

    notify_subscribers_by_email_for_submitted_enrollment
  end

  # TODO
  # if comment comes from demandeur
  #    then deliver_message_from_demandeur_to_enrollment_instructors(event, comment)
  # else
  #     deliver_event_mailer(__method__, comment)
  # end
  #
  # Think to use Guard Clause

  def notify(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end

  def request_changes(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end

  def refuse(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end

  def validate(comment:, current_user:)
    deliver_event_mailer(__method__, comment)

    if enrollment.team_members.exists?(type: "responsable_traitement")
      deliver_rgpd_email_for("responsable_traitement")
    end

    if enrollment.team_members.exists?(type: "delegue_protection_donnees")
      deliver_rgpd_email_for("delegue_protection_donnees")
    end
  end

  def revoke(comment:, current_user:)
    deliver_event_mailer(__method__, comment)
  end
end
