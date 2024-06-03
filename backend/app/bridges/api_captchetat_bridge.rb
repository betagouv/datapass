class ApiCaptchetatBridge < ApplicationBridge
  def call
    responsable_technique_email = @enrollment.team_members.where(type: "responsable_technique").pluck(:email).first
    linked_token_manager_id = create_enrollment_in_token_manager(
      @enrollment.id,
      responsable_technique_email
    )
    @enrollment.update({linked_token_manager_id: linked_token_manager_id})
  end

  private

  def create_enrollment_in_token_manager(
    id,
    responsable_technique_email
  )
    api_host = ENV.fetch("PISTE_HOST")
    auth_host = ENV.fetch("PISTE_AUTH_HOST")
    client_id = ENV.fetch("PISTE_CLIENT_ID")
    client_secret = ENV.fetch("PISTE_CLIENT_SECRET")

    # 1. get token
    token_response = Http.instance.post({
      url: "#{auth_host}/api/oauth/token",
      body: {grant_type: "client_credentials", scope: nil},
      api_key: Base64.strict_encode64("#{client_id}:#{client_secret}"),
      use_basic_auth_method: true,
      use_form_content_type: true,
      tag: "Piste"
    })

    token = token_response.parse
    access_token = token["access_token"]

    # 2. Send pass to Piste
    create_subscription_response = Http.instance.post({
      url: "#{api_host}/datapass/v1/approve",
      body: {
        requestor_email: responsable_technique_email,
        api_name: "CaptchEtat",
        approval_id: id
      },
      api_key: access_token,
      tag: "Piste"
    })

    create_subscription_response.parse["piste_app_prd_link"]
  end
end
