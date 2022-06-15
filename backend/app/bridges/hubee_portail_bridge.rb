class HubeePortailBridge < ApplicationBridge
  def call
    responsable_metier = @enrollment.team_members.find { |team_member| team_member["type"] == "responsable_metier" }
    siret = @enrollment[:siret]
    updated_at = @enrollment[:updated_at]
    validated_at = @enrollment.validated_at
    scopes = @enrollment[:scopes].reject { |k, v| !v }.keys
    linked_token_manager_id = create_enrollment_in_token_manager(
      @enrollment.id,
      responsable_metier,
      siret,
      updated_at,
      validated_at,
      scopes
    )
    @enrollment.update({linked_token_manager_id: linked_token_manager_id})
  end

  private

  def create_enrollment_in_token_manager(
    id,
    responsable_metier,
    siret,
    updated_at,
    validated_at,
    scopes
  )
    response = ApiSirene.call(siret)

    denomination = response[:denomination]
    sigle = response[:sigle]
    code_postal = response[:code_postal]
    code_commune = response[:code_commune]
    libelle_commune = response[:libelle_commune]

    api_host = ENV.fetch("HUBEE_HOST")
    hubee_auth_url = ENV.fetch("HUBEE_AUTH_URL")
    client_id = ENV.fetch("HUBEE_CLIENT_ID")
    client_secret = ENV.fetch("HUBEE_CLIENT_SECRET")

    # 1. get token
    token_response = Http.instance.post(
      "#{hubee_auth_url}/token",
      {grant_type: "client_credentials", scope: "ADMIN"},
      Base64.strict_encode64("#{client_id}:#{client_secret}"),
      "Portail HubEE",
      nil,
      "Basic"
    )

    token = token_response.parse
    access_token = token["access_token"]

    # 2.1 get organization
    begin
      Http.instance.get(
        "#{api_host}/referential/v1/organizations/SI-#{siret}-#{code_commune}",
        access_token,
        "Portail HubEE"
      )
    rescue ApplicationController::BadGateway => e
      if e.http_code == 404
        # 2.2 if organization does not exist, create the organization
        Http.instance.post(
          "#{api_host}/referential/v1/organizations",
          {
            type: "SI",
            companyRegister: siret,
            branchCode: code_commune,
            name: denomination,
            code: sigle,
            country: "France",
            postalCode: code_postal,
            territory: libelle_commune,
            email: responsable_metier["email"],
            phoneNumber: responsable_metier["phone_number"].delete(" ").delete(".").delete("-"),
            status: "Actif"
          },
          access_token,
          "Portail HubEE"
        )
      else
        raise
      end
    end

    # 3. create subscriptions
    subscription_ids = []
    scopes.each do |scope|
      create_subscription_response = Http.instance.post(
        "#{api_host}/referential/v1/subscriptions",
        {
          datapassId: id,
          processCode: scope,
          subscriber: {
            type: "SI",
            companyRegister: siret,
            branchCode: code_commune
          },
          accessMode: nil,
          notificationFrequency: "unitaire",
          activateDateTime: nil,
          validateDateTime: validated_at.iso8601,
          rejectDateTime: nil,
          endDateTime: nil,
          updateDateTime: updated_at.iso8601,
          delegationActor: nil,
          rejectionReason: nil,
          status: "Inactif",
          email: responsable_metier["email"],
          localAdministrator: {
            email: responsable_metier["email"],
            firstName: responsable_metier["given_name"],
            lastName: responsable_metier["family_name"],
            function: responsable_metier["job"],
            phoneNumber: responsable_metier["phone_number"].delete(" ").delete(".").delete("-"),
            mobileNumber: nil
          }
        },
        access_token,
        "Portail HubEE"
      )

      subscription_ids.push create_subscription_response.parse["id"]
    end

    subscription_ids.join(",")
  end
end
