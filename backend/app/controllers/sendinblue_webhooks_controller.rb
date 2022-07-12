class SendinblueWebhooksController < ApplicationController
  # You can configure webhook for this controller at https://app-smtp.sendinblue.com/webhook
  def rgpd_contact_error
    sendinblue_api_key = ENV["SENDINBLUE_API_KEY"]
    capability_url_id = ENV["RGPD_CONTACT_ERROR_HOOK_ID"]

    # 1. verify capability url id
    if params[:capability_url_id] != capability_url_id
      raise ApplicationController::Unauthorized
    end

    # 2. get message metadata
    body = JSON.parse request.body.read
    message_id = body["message-id"]
    get_transactional_email_reponse = Http.instance.get({
      url: "https://api.sendinblue.com/v3/smtp/emails?messageId=#{ERB::Util.url_encode(message_id)}",
      api_key: sendinblue_api_key,
      auth_header: "api-key",
      tag: "Sendinblue API v3"
    })
    transactional_email = get_transactional_email_reponse.parse

    # 3. exit if email was not about notifying rgpd contacts
    if transactional_email.empty? ||
        transactional_email["transactionalEmails"].length != 1 ||
        (transactional_email["transactionalEmails"][0]["tags"][0]["rgpd-contact-email"] != "rgpd-contact-email")
      # Note that there is no need to check that the event is an hard bounce or a soft bounce since this hook will be
      # called on this to events only.
      raise ApplicationController::Accepted, "no gdpr alert send"
    end

    email_uuid = transactional_email["transactionalEmails"][0]["uuid"]
    rgpd_contact_email = transactional_email["transactionalEmails"][0]["email"]
    rgpd_role = transactional_email["transactionalEmails"][0]["subject"][/(#{EnrollmentsController::RESPONSABLE_TRAITEMENT_LABEL}|#{EnrollmentsController::DELEGUE_PROTECTION_DONNEES_LABEL})/o, 1]

    # 4. get email content
    get_email_content_response = Http.instance.get({
      url: "https://api.sendinblue.com/v3/smtp/emails/#{email_uuid}",
      auth_header: "api-key",
      api_key: sendinblue_api_key,
      tag: "Sendinblue API v3"
    })
    email_content = get_email_content_response.parse

    environment = email_content["body"][/https:\/\/datapass(-[a-z]+)?.api.gouv.fr\/[a-z-]+\/([0-9]+)/, 1]
    unless environment.nil?
      # environment.nil? is production environment
      # we do not send rgpd mail for other env because the sendinblue hook is only configured on the production environment
      raise ApplicationController::Accepted, "no gdpr alert send, wrong environment"
    end

    enrollment_id = email_content["body"][/https:\/\/datapass(-[a-z]+)?.api.gouv.fr\/[a-z-]+\/([0-9]+)/, 2]
    enrollment = Enrollment.find(enrollment_id.to_i)
    instructor_email = enrollment.events.where(name: "validate")[0].user["email"]

    # 5. notify enrollment demandeurs that he made an error with the provided rgpd email
    RgpdMailer.with(
      target_api: enrollment[:target_api],
      to: enrollment.demandeurs.pluck(:email),
      enrollment_id: enrollment[:id],
      rgpd_role: rgpd_role,
      rgpd_contact_email: rgpd_contact_email,
      instructor_email: instructor_email
    ).rgpd_contact_error.deliver_now

    render status: :ok, json: {
      message: "gdpr alert sent!"
    }
  end
end
