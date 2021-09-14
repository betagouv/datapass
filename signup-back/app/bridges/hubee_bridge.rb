class HubeeBridge < ApplicationBridge
  def call
    email = @enrollment.demandeurs.pluck(:email).first
    phone_number = @enrollment.demandeurs.pluck(:phone_number).first
    team_members = @enrollment.team_members
    siret = @enrollment[:siret]
    updated_at = @enrollment[:updated_at]
    validated_at = @enrollment.validated_at
    linked_token_manager_id = create_enrollment_in_token_manager(
      @enrollment.id,
      email,
      phone_number,
      team_members,
      siret,
      updated_at,
      validated_at
    )
    @enrollment.update({linked_token_manager_id: linked_token_manager_id})
  end

  private

  def create_enrollment_in_token_manager(
    id,
    email,
    phone_number,
    team_members,
    siret,
    updated_at,
    validated_at
  )
    response = HTTP.get("https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/#{siret}")
    denomination = response.parse["etablissement"]["unite_legale"]["denomination"]
    sigle = response.parse["etablissement"]["unite_legale"]["sigle"]
    code_postal = response.parse["etablissement"]["code_postal"]
    code_commune = response.parse["etablissement"]["code_commune"]
    libelle_commune = response.parse["etablissement"]["libelle_commune"]

    api_host = ENV.fetch("HUBEE_HOST")
    hubee_auth_url = ENV.fetch("HUBEE_AUTH_URL")
    client_id = ENV.fetch("HUBEE_CLIENT_ID")
    client_secret = ENV.fetch("HUBEE_CLIENT_SECRET")

    # 1. get token
    token_response = Http.post(
      "#{hubee_auth_url}/token",
      {grant_type: "client_credentials", scope: "ADMIN"},
      Base64.strict_encode64("#{client_id}:#{client_secret}"),
      "HubEE",
      nil,
      "Basic"
    )

    token = token_response.parse
    access_token = token["access_token"]

    # 2.1 get organization
    begin
      Http.get(
        "#{api_host}/referential/v1/organizations/SI-#{siret}-#{code_commune}",
        access_token,
        "HubEE"
      )
    rescue ApplicationController::BadGateway => e
      if e.http_code == 404
        # 2.2 if organization does not exist, create the organization
        Http.post(
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
            email: email,
            phoneNumber: phone_number,
            status: "Actif"
          },
          access_token,
          "HubEE"
        )
      else
        raise
      end
    end

    # 3. create subscription
    delegation_actor = nil
    responsable_technique = team_members.find { |team_member| team_member["type"] == "responsable_technique" }
    unless responsable_technique.nil? && responsable_technique["email"].empty?
      delegation_actor = {
        email: ["email"],
        firstName: responsable_technique["given_name"],
        lastName: responsable_technique["family_name"],
        function: responsable_technique["job"],
        phoneNumber: responsable_technique["phone_number"],
        mobileNumber: nil
      }
    end
    contact_metier = team_members.find { |team_member| team_member["type"] == "contact_metier" }
    create_subscription_response = Http.post(
      "#{api_host}/referential/v1/subscriptions",
      {
        datapassId: id,
        processCode: "CERTDC",
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
        delegationActor: delegation_actor,
        rejectionReason: nil,
        status: "Inactif",
        email: email,
        localAdministrator: {
          email: contact_metier["email"],
          firstName: contact_metier["given_name"],
          lastName: contact_metier["family_name"],
          function: contact_metier["job"],
          phoneNumber: contact_metier["phone_number"],
          mobileNumber: nil
        }
      },
      access_token,
      "HubEE"
    )

    create_subscription_response.parse["id"]
  end
end
