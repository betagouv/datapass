class Enrollment::ProductionEnrollment < Enrollment
  include DgfipValidationMethods

  before_save :set_info_from_previous_enrollment, if: :will_save_change_to_previous_enrollment_id?

  protected

  def set_info_from_previous_enrollment
    self.intitule = previous_enrollment.intitule
    self.organization_id = previous_enrollment.organization_id
    set_company_info
  end

  def update_validation
    errors.add(:previous_enrollment_id, :invalid, message: "Vous devez associer cette demande d’habilitation à une habilitation API Impôt particulier validée. Aucun changement n’a été sauvegardé.") unless previous_enrollment_id.present?
    # the following 2 errors should never occur #defensiveprogramming
    errors.add(:target_api, :invalid, message: "Une erreur inattendue est survenue: pas d’API cible. Aucun changement n’a été sauvegardé.") unless target_api.present?
  end

  def submit_validation
    # Recette fonctionnelle
    errors.add(:additional_content, :invalid, message: "Vous devez attester avoir réaliser une recette fonctionnelle avant de continuer") unless additional_content&.fetch("recette_fonctionnelle", false)&.present?

    production_form_validation
  end
end
