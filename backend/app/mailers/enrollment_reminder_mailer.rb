# frozen_string_literal: true

class EnrollmentReminderMailer < ActionMailer::Base
  layout false

  def reminder_draft_enrollment_email
    @target_api_label = data_provider_config["label"]
    @enrollment = Enrollment.find(params[:enrollment_id])
    @demandeur_given_name = @enrollment.demandeurs.first.given_name
    @demadeur_family_name = @enrollment.demandeurs.first.family_name
    @url = "#{ENV.fetch("FRONT_HOST")}/#{params[:target_api].tr("_", "-")}/#{params[:enrollment_id]}"

    mail(
      to: @enrollment.demandeurs.pluck(:email),
      from: "notifications@api.gouv.fr",
      subject: "<%= given_name %>, votre demande d'habilitation à <%= target_api_label %> vous attend.",
      template_path: "enrollment_mailer/demandeur",
      template_name: "reminder_draft_enrollment"
    )
  end

  private

  def data_provider_config
    @data_provider_config ||= DataProviderConfigurations.instance.config_for(params[:target_api])
  end
end
