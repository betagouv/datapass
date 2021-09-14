class RgpdMailer < ActionMailer::Base
  def initialize
    @send_in_blue = SibApiV3Sdk::SMTPApi.new
  end

  def rgpd_contact_email
    data_provider_config = data_providers_config.config_for(params[:target_api])
    target_api_label = data_provider_config["label"]

    email = SibApiV3Sdk::SendSmtpEmail.new({
      to: [{
        email: params[:to]
      }],
      subject: "Vous avez été désigné #{params[:rgpd_role]} pour l’organisation #{params[:nom_raison_sociale]}",
      sender: {
        name: "L’équipe d’api.gouv.fr",
        email: "contact@api.gouv.fr"
      },
      replyTo: {
        name: "L’équipe d’api.gouv.fr",
        email: "contact@api.gouv.fr"
      },
      templateId: 8,
      params: {
        target_api_label: target_api_label,
        rgpd_role: params[:rgpd_role],
        contact_label: params[:contact_label],
        owner_email: params[:demandeur_email],
        nom_raison_sociale: params[:nom_raison_sociale],
        intitule: params[:intitule],
        url: "#{ENV.fetch("FRONT_HOST").sub(/^https:\/\//, "")}/#{params[:target_api].tr("_", "-")}/#{params[:enrollment_id]}"
      },
      tags: ["rgpd-contact-email"]
    })

    begin
      result = @send_in_blue.send_transac_email(email)
      Rails.logger.info "Email sent with id: #{result.inspect}"
    rescue SibApiV3Sdk::ApiError => e
      Sentry.capture_exception(e)
    end
  end

  def rgpd_contact_error
    data_provider_config = data_providers_config.config_for(params[:target_api])
    target_api_label = data_provider_config["label"]

    email = SibApiV3Sdk::SendSmtpEmail.new({
      to: [{
        email: params[:to]
      }],
      cc: [{
        email: "datapass@api.gouv.fr"
      }, {
        email: params[:instructor_email]
      }],
      subject: "Votre demande d’habilitation à #{target_api_label}",
      sender: {
        name: "L’équipe DataPass",
        email: "datapass@api.gouv.fr"
      },
      replyTo: {
        name: "L’équipe DataPass",
        email: "datapass@api.gouv.fr"
      },
      templateId: 13,
      params: {
        target_api_label: target_api_label,
        enrollment_id: params[:enrollment_id],
        date: params[:date],
        rgpd_role: params[:rgpd_role],
        rgpd_contact_email: params[:rgpd_contact_email],
        url: "#{ENV.fetch("FRONT_HOST").sub(/^https:\/\//, "")}/#{params[:target_api].tr("_", "-")}/#{params[:enrollment_id]}"
      },
      tags: ["rgpd-contact-error"]
    })

    begin
      result = @send_in_blue.send_transac_email(email)
      Rails.logger.info "Email sent with id: #{result.inspect}"
    rescue SibApiV3Sdk::ApiError => e
      Sentry.capture_exception(e)
    end
  end

  private

  def data_providers_config
    DataProvidersConfiguration.instance
  end
end
