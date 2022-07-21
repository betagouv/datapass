# frozen_string_literal: true

module EmailNotifierMethods
  protected

  def deliver_created_mail_to_enrollment_demandeurs
    EnrollmentMailer.with(
      to: enrollment.demandeurs.pluck(:email),
      target_api: enrollment.target_api,
      enrollment_id: enrollment.id,
      event_name: "create"
    ).notification_email.deliver_later
  end

  def deliver_event_mailer(event, comment)
    EnrollmentMailer.with(
      to: enrollment.demandeurs.pluck(:email),
      target_api: enrollment.target_api,
      enrollment_id: enrollment.id,
      event_name: event.to_s,
      comment: comment
    ).notification_email.deliver_later
  end

  def deliver_rgpd_email_for(type)
    RgpdMailer.with(
      to: enrollment.public_send("#{type}_email"),
      target_api: enrollment.target_api,
      enrollment_id: enrollment.id,
      rgpd_role: Kernel.const_get("EnrollmentsController::#{type.upcase}_LABEL"),
      contact_label: enrollment.public_send("#{type}_full_name"),
      demandeur_email: enrollment.demandeurs.pluck(:email).first,
      nom_raison_sociale: enrollment.nom_raison_sociale,
      intitule: enrollment.intitule
    ).rgpd_contact_email.deliver_later
  end

  def notify_subscribers_by_email_for_submitted_enrollment
    EnrollmentMailer.with(
      to: enrollment.subscribers.pluck(:email),
      target_api: enrollment.target_api,
      enrollment_id: enrollment.id,
      event_name: "notify_submitted",
      demandeur_email: enrollment.demandeurs.pluck(:email).first
    ).notification_email.deliver_later
  end
end
