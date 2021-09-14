class Enrollment::LeTaxiClients < Enrollment
  def sent_validation
    unless team_members.exists?(type: "responsable_technique")
      errors[:team_members] << "Vous devez renseigner un contact responsable technique avant de continuer"
    end
    team_members.where(type: "responsable_technique").each do |team_member|
      errors[:team_members] << "Vous devez renseigner un email valide pour le responsable technique avant de continuer" unless URI::MailTo::EMAIL_REGEXP.match?(team_member.email)
    end

    rgpd_validation

    errors[:description] << "Vous devez renseigner la description de la démarche avant de continuer" unless description.present?
    errors[:siret] << "Vous devez renseigner un SIRET d’organisation valide avant de continuer" unless nom_raison_sociale.present?
    errors[:cgu_approved] << "Vous devez valider les modalités d’utilisation avant de continuer" unless cgu_approved?
  end
end
