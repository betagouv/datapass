class FranceconnectBridge < ApplicationBridge
  def call
    nom_raison_sociale = @enrollment.nom_raison_sociale
    scopes = @enrollment.scopes
    eidas_level = @enrollment.additional_content&.fetch("eidas_level", "")
    id = @enrollment.id

    if eidas_level == "2"
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
