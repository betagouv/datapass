class Enrollment::UniqueEnrollment < Enrollment
  protected

  def submit_validation
    super

    responsable_technique_validation

    # Cadre juridique
    cadre_juridique_validation

    # Homologation de securite
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner le nom de l’autorité d’homologation avant de continuer") unless additional_content&.fetch("autorite_homologation_nom", false)&.present?
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner la fonction de l’autorité d’homologation avant de continuer") unless additional_content&.fetch("autorite_homologation_fonction", false)&.present?
    date_regex = /^\d{4}-\d{2}-\d{2}$/
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner la date de début de l’homologation au format AAAA-MM-JJ avant de continuer") unless date_regex.match?(additional_content&.fetch("date_homologation", ""))
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner la date de fin de l’homologation au format AAAA-MM-JJ avant de continuer") unless date_regex.match?(additional_content&.fetch("date_fin_homologation", ""))
    errors.add(:documents, :invalid, message: "Vous devez joindre le document de décision d’homologation avant de continuer") unless documents.where(type: "Document::DecisionHomologation").present?

    # Volumétrie
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner la limitation d’appels par minute avant de continuer") unless additional_content&.fetch("volumetrie_appels_par_minute", false)&.present?

    # CGU
    errors.add(:cgu_approved, :invalid, message: "Vous devez valider les modalités d’utilisation avant de continuer") unless cgu_approved?
    errors.add(:dpo_is_informed, :invalid, message: "Vous devez confirmer avoir informé le DPD de votre organisation avant de continuer") unless dpo_is_informed?
  end
end
