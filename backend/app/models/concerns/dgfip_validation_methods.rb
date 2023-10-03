# frozen_string_literal: true

module DgfipValidationMethods
  protected

  def no_need_to_select_scopes?
    additional_content&.fetch("specific_requirements", false)
  end

  def rgpd_general_agreement_validation
    unless additional_content&.fetch("rgpd_general_agreement", false)
      errors.add(:additional_content, :invalid, message: "Vous devez attester que votre organisation déclarera à la DGFiP l'accomplissement des formalités en terme de protection des données")
    end
  end

  def api_impot_particulier_scope_validation
    return if no_need_to_select_scopes?

    if (scopes & %w[dgfip_annee_n_moins_1 dgfip_annee_n_moins_2 dgfip_annee_n_moins_3 dgfip_annee_n_moins_2_si_indispo_n_moins_1]).empty?
      errors.add(:scopes, :invalid, message: "Vous devez cocher au moins une année de revenus souhaitée avant de continuer")
    end
  end

  def api_impot_particulier_acces_validation
    unless additional_content.any? { |k, v| v && %w[acces_spi acces_etat_civil].include?(k) }
      errors.add(:scopes, :invalid, message: "Vous devez cocher au moins une modalité d’accès avant de continuer")
    end
  end

  def production_form_validation
    # Cadre juridique
    cadre_juridique_validation

    # Homologation de securite
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner le nom de l’autorité d’homologation ou du signataire du questionnaire de sécurité avant de continuer") unless additional_content&.fetch("autorite_homologation_nom", false)&.present?
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner la fonction de l’autorité d’homologation ou du signataire du questionnaire de sécurité avant de continuer") unless additional_content&.fetch("autorite_homologation_fonction", false)&.present?
    date_regex = /^\d{4}-\d{2}-\d{2}$/
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner la date de début de l’homologation ou de signature du questionnaire de sécurité au format AAAA-MM-JJ avant de continuer") unless date_regex.match?(additional_content&.fetch("date_homologation", ""))
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner la date de fin de l’homologation au format AAAA-MM-JJ avant de continuer") unless date_regex.match?(additional_content&.fetch("date_fin_homologation", ""))
    errors.add(:documents, :invalid, message: "Vous devez joindre le document de décision d’homologation ou le questionnaire de sécurité avant de continuer") unless documents.where(type: "Document::DecisionHomologation").present?

    # Volumétrie
    errors.add(:additional_content, :invalid, message: "Vous devez renseigner la limitation d’appels par minute avant de continuer") unless additional_content&.fetch("volumetrie_appels_par_minute", false)&.present?

    # CGU
    errors.add(:cgu_approved, :invalid, message: "Vous devez valider les modalités d’utilisation avant de continuer") unless cgu_approved?
    errors.add(:dpo_is_informed, :invalid, message: "Vous devez confirmer avoir informé le DPD de votre organisation avant de continuer") unless dpo_is_informed?
  end
end
