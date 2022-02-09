class FranceconnectBridge < ApplicationBridge
  def call
    nom_raison_sociale = @enrollment.nom_raison_sociale
    intitule = @enrollment.intitule
    email = @enrollment.team_members.where(type: "responsable_technique").pluck(:email).first
    scopes = @enrollment[:scopes].reject { |k, v| !v }.keys
    eidas_level = @enrollment.additional_content&.fetch("eidas_level", "")
    copied_from_enrollment_id = @enrollment.copied_from_enrollment_id
    create_enrollment_in_token_manager(@enrollment.id, intitule, nom_raison_sociale, email, scopes, eidas_level, copied_from_enrollment_id)
  end

  private

  def create_enrollment_in_token_manager(id, intitule, nom_raison_sociale, email, scopes, eidas_level, copied_from_enrollment_id)
    if eidas_level == "1"
      # note that the FC team test this call with this bash script: https://gitlab.com/france-connect/FranceConnect/snippets/1828712
      response = Http.post(
        "#{ENV.fetch("FRANCECONNECT_PARTICULIER_HOST")}/api/v2/service-provider/integration/create",
        {
          name: "#{nom_raison_sociale} - #{id}",
          service_name: intitule,
          corporate_name: nom_raison_sociale,
          authorized_emails: [email],
          signup_id: id,
          datapass_id: id,
          scopes: scopes,
          copied_from_datapass_id: copied_from_enrollment_id
        },
        ENV.fetch("FRANCECONNECT_PARTICULIER_API_KEY"),
        "Espace Partenaire FranceConnect"
      )

      # The id returned here is the DataPass id. It is not a generated id from "espace partenaires".
      response.parse["_id"]
    else
      # there is no espace partenaire for fc+ yet so we just notify fc support team
      EnrollmentMailer.with(
        target_api: "franceconnect",
        subject: "[DataPass] l’habilitation FranceConnect+ n°#{id} vient d’être validée",
        template_name: "new_franceconnect_plus",
        nom_raison_sociale: nom_raison_sociale,
        enrollment_id: id,
        scopes: scopes
      ).notify_support_franceconnect.deliver_later
    end
  end
end
