class Enrollment::DgfipDeprecated::SandboxEnrollment < Enrollment
  protected

  def submit_validation
    # Organisation
    errors[:siret] << "Vous devez renseigner un SIRET d’organisation valide avant de continuer" unless nom_raison_sociale.present?

    # Description
    errors[:description] << "Vous devez renseigner la description de la démarche avant de continuer" unless description.present?

    # Mise en œuvre
    responsable_technique_validation
    team_members.where(type: "responsable_technique").each do |team_member|
      errors[:team_members] << "Vous devez renseigner un prénom pour le responsable technique avant de continuer" if team_member.given_name.to_s.strip.empty?
      errors[:team_members] << "Vous devez renseigner un nom pour le responsable technique avant de continuer" if team_member.family_name.to_s.strip.empty?
    end

    # CGU
    errors[:cgu_approved] << "Vous devez valider les modalités d’utilisation avant de continuer" unless cgu_approved?
  end
end
