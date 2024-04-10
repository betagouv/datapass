class Enrollment::ApiInfinoeProduction < Enrollment::AbstractDgfipProductionEnrollment
  def production_form_validation
    # Cadre juridique
    cadre_juridique_validation

    # Volumétrie
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner la limitation d’appels par minute avant de continuer") unless additional_content&.fetch("volumetrie_appels_par_minute", false)&.present?

    # CGU
    errors.add(:cgu_approved, :invalid, message: "Vous devez valider les modalités d’utilisation avant de continuer") unless cgu_approved?
    errors.add(:dpo_is_informed, :invalid, message: "Vous devez confirmer avoir informé le DPD de votre organisation avant de continuer") unless dpo_is_informed?
  end
end
