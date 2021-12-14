class Enrollment::Dgfip::SandboxEnrollment < Enrollment
  protected

  def submit_validation
    rgpd_validation

    errors[:description] << "Vous devez renseigner la description de la démarche avant de continuer" unless description.present?
    errors[:siret] << "Vous devez renseigner un SIRET d’organisation valide avant de continuer" unless nom_raison_sociale
    errors[:cgu_approved] << "Vous devez valider les modalités d’utilisation avant de continuer" unless cgu_approved?
    errors[:rgpd_general_agreement] << "Vous devez attester respecter les principes RGPD avant de continuer" unless additional_content&.fetch("rgpd_general_agreement", false)

    responsable_technique_validation
  end
end
