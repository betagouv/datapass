# frozen_string_literal: true

class EnrollmentReminderMailer < ActionMailer::Base
  layout false

  def reminder_draft_enrollment_email
    @target_api_label = data_provider_config["label"]
    @enrollment = Enrollment.find(params[:enrollment_id])
    @url = @enrollment.link

    mail(
      to: @enrollment.demandeurs.pluck(:email),
      from: "notifications@api.gouv.fr",
      subject: "Votre demande d’habilitation à #{@target_api_label} vous attend.",
      template_path: "enrollment_mailer/demandeur",
      template_name: "reminder_draft_enrollment"
    )
  end

  def reminder_changes_requested_enrollment_email
    @target_api_label = data_provider_config["label"]
    @enrollment = Enrollment.find(params[:enrollment_id])

    mail(
      to: @enrollment.demandeurs.pluck(:email),
      from: "notifications@api.gouv.fr",
      subject: "Votre demande d’habilitation à #{@target_api_label} vous attend.",
      template_path: "enrollment_mailer/demandeur",
      template_name: "reminder_changes_requested_enrollment"
    )
  end

  private

  def data_provider_config
    @data_provider_config ||= DataProviderConfigurations.instance.config_for(params[:target_api])
  end
end
