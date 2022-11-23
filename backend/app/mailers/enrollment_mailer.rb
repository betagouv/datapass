# frozen_string_literal: true

class EnrollmentMailer < ActionMailer::Base
  layout false

  def notification_email
    @enrollment = Enrollment.find(params[:enrollment_id])
    @user = @enrollment.demandeurs.first

    @target_api_label = data_provider_config["label"]
    @message = params[:message]
    @demandeur_email = params[:demandeur_email]
    @scopes = params[:scopes]

    if !params[:responsable_metier_email].nil?
      @responsable_metier_email = params[:responsable_metier_email]
    end

    @url = "#{ENV.fetch("FRONT_HOST")}/#{params[:target_api].tr("_", "-")}/#{params[:enrollment_id]}"
    @front_host = ENV.fetch("FRONT_HOST")

    @majority_percentile_processing_time_in_days = nil
    if params[:template] == "submit"
      @majority_percentile_processing_time_in_days = GetMajorityPercentileProcessingTimeInDays.call(params[:target_api])
    end

    if Event::EVENTS_WITH_COMMENT_AS_EMAIL_BODY.include?(params[:template])
      render_mail(
        body: params[:message]
      )
    else
      render_mail(
        template_name: params[:template]
      )
    end
  end

  def notification_email_to_instructors
    @enrollment = Enrollment.find(params[:enrollment_id])
    @demandeur_email = @enrollment.demandeurs.pluck(:email).first
    @demandeur_given_name = @enrollment.demandeurs.first.given_name
    @demadeur_family_name = @enrollment.demandeurs.first.family_name
    @message = params[:message]
    @url = "#{ENV.fetch("FRONT_HOST")}/#{params[:target_api].tr("_", "-")}/#{params[:enrollment_id]}"

    mail(
      to: @enrollment.subscribers.pluck(:email),
      from: "notifications@api.gouv.fr",
      subject: "Vous avez un nouveau message concernant une habilitation",
      template_path: "enrollment_mailer/admin",
      template_name: "notification_email_to_instructors"
    )
  end

  def notification_delete_event_to_instructors
    @enrollment = Enrollment.find(params[:enrollment_id])
    @enrollment_id = @enrollment.id
    @event_delete = @enrollment.events.last
    @instructor_email = User.find_by(@event_delete.user_id).email

    mail(
      to: @enrollment.subscribers.pluck(:email),
      from: "notifications@api.gouv.fr",
      subject: "Une habilitation a été supprimé",
      template_path: "enrollment_mailer/admin",
      template_name: "notification_delete_event_to_instructors"
    )
  end

  def new_enrollment_submission_notification_email
    @target_api_label = data_provider_config["label"]
    @enrollment = Enrollment.find(params[:enrollment_id])
    @demandeur_email = @enrollment.demandeurs.pluck(:email).first
    @url = "#{ENV.fetch("FRONT_HOST")}/#{params[:target_api].tr("_", "-")}/#{params[:enrollment_id]}"

    mail(
      to: @enrollment.subscribers.pluck(:email),
      from: "notifications@api.gouv.fr",
      subject: "Nouvelle demande d’habilitation sur DataPass",
      template_path: "enrollment_mailer/instructor",
      template_name: "notify_submitted"
    )
  end

  def submission_after_changes_requested_notification_email
    @target_api_label = data_provider_config["label"]
    @enrollment = Enrollment.find(params[:enrollment_id])
    @demandeur_email = @enrollment.demandeurs.pluck(:email).first
    @url = "#{ENV.fetch("FRONT_HOST")}/#{params[:target_api].tr("_", "-")}/#{params[:enrollment_id]}"

    mail(
      to: @enrollment.subscribers.pluck(:email),
      from: "notifications@api.gouv.fr",
      subject: "Retour sur votre demande de modification",
      template_path: "enrollment_mailer/instructor",
      template_name: "notify_submitted"
    )
  end

  def notify_support_franceconnect
    @target_api_label = data_provider_config["label"]
    @nom_raison_sociale = params[:nom_raison_sociale]
    @previous_enrollment_id = params[:previous_enrollment_id]
    @scopes = params[:scopes]
    @url = "#{ENV.fetch("FRONT_HOST")}/#{params[:target_api].tr("_", "-")}/#{params[:enrollment_id]}"

    mail(
      to: "support.partenaires@franceconnect.gouv.fr",
      subject: params[:subject],
      from: "datapass@api.gouv.fr",
      cc: "datapass@api.gouv.fr",
      template_path: "enrollment_mailer/admin",
      template_name: params[:template_name]
    )
  end

  def notification_email_unknown_software
    @target_api_label = data_provider_config["label"]
    @enrollment = Enrollment.find(params[:enrollment_id])
    @url = "#{ENV.fetch("FRONT_HOST")}/#{params[:target_api].tr("_", "-")}/#{params[:enrollment_id]}"

    mail(
      to: "datapass@api.gouv.fr",
      from: "datapass@api.gouv.fr",
      subject: "Editeur avec un Siret inconnu",
      template_path: "enrollment_mailer/admin",
      template_name: "notify_unknown_software"
    )
  end

  private

  def render_mail(attributes)
    subject = data_provider_mailer_config["subject"]
    headers = {
      to: params[:to],
      subject: subject,
      from: "notifications@api.gouv.fr"
    }

    if data_provider_config["reply_to"]
      headers[:reply_to] = data_provider_config["reply_to"]
    end

    mail(headers) do |format|
      format.text do
        if attributes[:body]
          render plain: attributes[:body]
        else
          render template: extract_template_path(attributes[:template_name])
        end
      end
    end
  end

  def extract_template_path(template_name)
    if custom_template_exists?(template_name)
      "enrollment_mailer/#{params[:target_api]}/#{template_name}"
    else
      "enrollment_mailer/#{template_name}"
    end
  end

  def custom_template_exists?(template_name)
    File.exist?(
      Rails.root.join(
        File.join(
          "app/views/enrollment_mailer/#{params[:target_api]}/#{template_name}.text.erb"
        )
      )
    )
  end

  def data_provider_mailer_config
    @data_provider_mailer_config ||= data_provider_config["mailer"][params[:template]]
  end

  def data_provider_config
    @data_provider_config ||= DataProviderConfigurations.instance.config_for(params[:target_api])
  end
end
