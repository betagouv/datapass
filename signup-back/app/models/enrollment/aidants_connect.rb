class Enrollment::AidantsConnect < Enrollment
  protected

  def sent_validation
    team_members_validation("contact_metier", "responsable Aidants Connect", true)

    errors[:description] << "Vous devez renseigner la description de la démarche avant de continuer" unless description.present?
    errors[:siret] << "Vous devez renseigner un SIRET d’organisation valide avant de continuer" unless nom_raison_sociale

    errors[:organization_type] << "Vous devez renseigner le type de la structure avant de continuer" unless additional_content&.fetch("organization_type", false)&.present?
    errors[:organization_address] << "Vous devez renseigner l’adresse de la structure avant de continuer" unless additional_content&.fetch("organization_address", false)&.present?
    if additional_content&.fetch("organization_postal_code", false)&.present?
      postal_code_regex = /^\d{5}$/
      errors[:organization_postal_code] << "Vous devez renseigner un code postal valide avant de continuer" unless postal_code_regex.match?(additional_content&.fetch("organization_postal_code", ""))
    else
      errors[:organization_postal_code] << "Vous devez renseigner le code postal de la structure avant de continuer"
    end
    errors[:organization_city] << "Vous devez renseigner la ville de la structure avant de continuer" unless additional_content&.fetch("organization_city", false)&.present?
    unless [true, false].include? additional_content&.fetch("participation_reseau", "")
      errors[:participation_reseau] << "Merci de préciser si vous participez à un réseau régional ou local"
    end

    unless [true, false].include? additional_content&.fetch("utilisation_identifiants_usagers", "")
      errors[:utilisation_identifiants_usagers] << "Merci de préciser si les aidants réalisent des démarches administratives à la place d’usagers"
    end
    unless [true, false].include? additional_content&.fetch("adresse_mail_professionnelle", "")
      errors[:adresse_mail_professionnelle] << "Merci de préciser si les aidants ont bien une adresse mail professionnelle individuelle"
    end
    unless documents.where(type: "Document::ListeAidants").present?
      errors[:documents_attributes] << "Vous devez joindre la liste des aidants à habiliter avant de continuer"
    end

    errors[:cgu_approved] << "Vous devez valider les modalités d’utilisation avant de continuer" unless cgu_approved?
    unless additional_content&.fetch("has_professional_contact_only", false)&.present?
      errors[:has_professional_contact_only] << "Vous devez valider que la liste des aidants à habiliter contient exclusivement des aidants professionnels avant de continuer"
    end
    unless additional_content&.fetch("has_non_elected_contact_only", false)&.present?
      errors[:has_non_elected_contact_only] << "Vous devez valider qu’aucun élu n’est impliqué dans l’habilitation Aidants Connect"
    end
  end
end
