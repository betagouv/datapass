class Enrollment::Hubee < Enrollment
  protected

  def sent_validation
    errors[:siret] << "Vous devez renseigner un SIRET d’organisation valide avant de continuer" unless nom_raison_sociale

    errors[:demarche] << "Vous devez sélectionner une démarche en ligne avant de continuer" unless demarche.present?

    errors[:description] << "Vous devez renseigner la description de la démarche avant de continuer" unless description.present?

    cadre_juridique_validation

    team_members_validation("contact_metier", "responsable abonnement", true)

    errors[:nom_application_metier] << "Vous devez renseigner le nom de l’application métier avant de continuer" unless additional_content&.fetch("nom_application_metier", false)&.present?
    errors[:nom_editeur] << "Vous devez renseigner le nom de l’éditeur avant de continuer" unless additional_content&.fetch("nom_editeur", false)&.present?
    errors[:numero_version] << "Vous devez renseigner le numéro de version avant de continuer" unless additional_content&.fetch("numero_version", false)&.present?

    errors[:cgu_approved] << "Vous devez valider les modalités d’utilisation avant de continuer" unless cgu_approved?
  end
end
