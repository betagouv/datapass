class HubeePortailBridge < ApplicationBridge
  def call
    responsable_metier = @enrollment.team_members.find { |team_member| team_member["type"] == "responsable_metier" }
    siret = @enrollment[:siret]
    updated_at = @enrollment[:updated_at]
    validated_at = @enrollment.validated_at
    scopes = @enrollment.scopes
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

    hubee_configuration = Credentials.get(:hubee)
    api_host = hubee_configuration[:host]
    hubee_auth_url = hubee_configuration[:auth_url]
    client_id = hubee_configuration[:client_id]
    client_secret = hubee_configuration[:client_secret]

    # 1. get token
    token_response = Http.instance.post({
      url: hubee_auth_url,
      body: {grant_type: "client_credentials", scope: "ADMIN"},
      api_key: Base64.strict_encode64("#{client_id}:#{client_secret}"),
      use_basic_auth_method: true,
      tag: "Portail HubEE"
    })

    token = token_response.parse
    access_token = token["access_token"]

    # 2.1 get organization
    begin
      Http.instance.get({
        url: "#{api_host}/referential/v1/organizations/SI-#{siret}-#{code_commune}",
        api_key: access_token,
        tag: "Portail HubEE"
      })
    rescue ApplicationController::BadGateway => e
      if e.http_code == 404
        # 2.2 if organization does not exist, create the organization
        Http.instance.post({
          url: "#{api_host}/referential/v1/organizations",
          body: {
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
          api_key: access_token,
          tag: "Portail HubEE"
        })
      else
        raise
      end
    end

    # 3. create subscriptions
    subscription_ids = []
    scopes.each do |scope|
      create_subscription_response = Http.instance.post({
        url: "#{api_host}/referential/v1/subscriptions",
        body: {
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
        api_key: access_token,
        tag: "Portail HubEE"
      })

      subscription_ids.push create_subscription_response.parse["id"]
    end

    subscription_ids.join(",")
  end
end
