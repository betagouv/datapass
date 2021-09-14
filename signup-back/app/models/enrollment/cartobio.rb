class Enrollment::Cartobio < Enrollment
  def sent_validation
    unless team_members.exists?(type: "responsable_technique")
      errors[:team_members] << "Vous devez renseigner un contact responsable technique avant de continuer"
    end
    team_members.where(type: "responsable_technique").each do |team_member|
      errors[:team_members] << "Vous devez renseigner un email valide pour le responsable technique avant de continuer" unless URI::MailTo::EMAIL_REGEXP.match?(team_member.email)
    end

    errors[:description] << "Vous devez renseigner la description de la démarche avant de continuer" unless description.present?
    errors[:siret] << "Vous devez renseigner un SIRET d’organisation valide avant de continuer" unless nom_raison_sociale.present?

    # Données
    unless additional_content&.fetch("location_scopes", false)&.present? || documents.where(type: "Document::GeoShape").present?
      errors[:location_scopes] << "Vous devez renseigner le périmètre de données"
    end

    # Modalités d’utilisation
    errors[:secret_statistique_agreement] << "Vous devez valider le respect du secret statistique avant de continuer" unless additional_content&.fetch("secret_statistique_agreement", false)&.present?
    errors[:partage_agreement] << "Vous devez valider la restriction du partage des données avant de continuer" unless additional_content&.fetch("partage_agreement", false)&.present?
    errors[:protection_agreement] << "Vous devez valider la mise en œuvre des mesures limitant la divulgation des données avant de continuer" unless additional_content&.fetch("protection_agreement", false)&.present?
    errors[:exhaustivite_agreement] << "Vous devez valider avoir pris connaissance de la non exhaustivité des données avant de continuer" unless additional_content&.fetch("exhaustivite_agreement", false)&.present?
    errors[:information_agreement] << "Vous devez valider l’information systématique à l’équipe CartoBio avant de continuer" unless additional_content&.fetch("information_agreement", false)&.present?
  end
end
