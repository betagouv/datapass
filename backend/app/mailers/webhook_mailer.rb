# frozen_string_literal: true

class WebhookMailer < ActionMailer::Base
  layout false

  def fail
    @webhook_url = ENV["#{params[:target_api].upcase}_WEBHOOK_URL"]
    @payload = JSON.pretty_generate(params[:payload])
    @webhook_response_body = params[:webhook_response_body]
    @webhook_response_status = params[:webhook_response_status]
    @api_manager_label = api_manager_label

    mail(
      subject: "[DataPass] Erreur de communication avec votre #{api_manager_label}",
      to: target_api_instructor_emails,
      from: "datapass@api.gouv.fr",
      cc: "datapass@api.gouv.fr"
    )
  end

  private

  def target_api_instructor_emails
    User.where("'#{params[:target_api]}:instructor' = ANY(roles)").pluck(:email)
  end

  def api_manager_label
    target_api_data["api_manager_label"]
  end

  def target_api_data
    DataProviderConfigurations.instance.config_for(params[:target_api])
  end
end
