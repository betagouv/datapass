class Enrollment::DgfipDeprecated::ProductionEnrollment < Enrollment
  before_save :set_info_from_previous_enrollment, if: :will_save_change_to_previous_enrollment_id?

  protected

  def set_info_from_previous_enrollment
    self.intitule = previous_enrollment.intitule
    self.organization_id = previous_enrollment.organization_id
    set_company_info
  end

  def update_validation
    errors[:previous_enrollment_id] << "Vous devez associer cette demande à une demande API Impôt particulier validée. Aucun changement n’a été sauvegardé." unless previous_enrollment_id.present?
    # the following 2 errors should never occur #defensiveprogramming
    errors[:target_api] << "Une erreur inattendue est survenue: pas d’API cible. Aucun changement n’a été sauvegardé." unless target_api.present?
  end

  def submit_validation
    # Recette fonctionnelle
    errors[:recette_fonctionnelle] << "Vous devez attester avoir réaliser une recette fonctionnelle avant de continuer" unless additional_content&.fetch("recette_fonctionnelle", false)&.present?

    # Données personnelles
    rgpd_validation

    # Cadre juridique
    cadre_juridique_validation

    # Homologation de securite
    errors[:autorite_homologation_nom] << "Vous devez renseigner le nom de l’autorité d’homologation avant de continuer" unless additional_content&.fetch("autorite_homologation_nom", false)&.present?
    errors[:autorite_homologation_fonction] << "Vous devez renseigner la fonction de l’autorité d’homologation avant de continuer" unless additional_content&.fetch("autorite_homologation_fonction", false)&.present?
    date_regex = /^\d{4}-\d{2}-\d{2}$/
    errors[:date_homologation] << "Vous devez renseigner la date de début de l’homologation au format AAAA-MM-JJ avant de continuer" unless date_regex.match?(additional_content&.fetch("date_homologation", ""))
    errors[:date_fin_homologation] << "Vous devez renseigner la date de fin de l’homologation au format AAAA-MM-JJ avant de continuer" unless date_regex.match?(additional_content&.fetch("date_fin_homologation", ""))
    errors[:documents_attributes] << "Vous devez joindre le document de décision d’homologation avant de continuer" unless documents.where(type: "Document::DecisionHomologation").present?

    # Volumétrie
    errors[:volumetrie_appels_par_minute] << "Vous devez renseigner la limitation d’appels par minute avant de continuer" unless additional_content&.fetch("volumetrie_appels_par_minute", false)&.present?

    # CGU
    errors[:cgu_approved] << "Vous devez valider les modalités d’utilisation avant de continuer" unless cgu_approved?
  end
end
