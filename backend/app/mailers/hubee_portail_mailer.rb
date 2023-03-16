# frozen_string_literal: true

class HubeePortailMailer < ActionMailer::Base
  layout false

  def archive_hubee_portail_enrollment_email
    @enrollment = Enrollment.find(params[:enrollment_id])

    mail(
      to: @enrollment.demandeurs.first.email,
      from: "notifications@api.gouv.fr",
      subject: "Votre demande d’habilitation Portail HubEE - Démarche CertDC va être archivée.",
      template_path: "enrollment_mailer/hubee_portail",
      template_name: "archive"
    )
  end
end
