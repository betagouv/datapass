# frozen_string_literal: true

module DgfipValidationMethods
  protected

  def no_need_to_select_scopes?
    additional_content&.fetch("specific_requirements", false)
  end

  def rgpd_general_agreement_validation
    return if additional_content&.fetch("rgpd_general_agreement", false)

    errors.add(:additional_content, :invalid, message: "Vous devez attester que votre organisation déclarera à la DGFiP l'accomplissement des formalités en terme de protection des données")

  end

  def api_impot_particulier_scope_validation
    return if no_need_to_select_scopes?

    incompatible_scopes = %w[
      dgfip_indiIFI dgfip_RevDecl_Cat1_Tspr dgfip_RevDecl_Cat5_NonSal
      dgfip_RevNets_Cat1_Tspr dgfip_RevNets_Cat1_RentOn dgfip_RevNets_Cat2_Rcm
      dgfip_RevNets_Cat3_PMV dgfip_RevNets_Cat4_Ref dgfip_RevNets_Cat5_NonSal
      dgfip_PaDeduc_EnfMaj dgfip_PaDeduc_Autres dgfip_EpargRetrDeduc dgfip_IndLep
    ]

    validate_revenue_years_selection
    validate_incompatible_scopes(incompatible_scopes)
    validate_exclusive_years_scope_combination
  end

  def api_impot_particulier_acces_validation
    return if additional_content.any? { |k, v| v && %w[acces_spi acces_etat_civil].include?(k) }

    errors.add(:scopes, :invalid, message: "Vous devez cocher au moins une modalité d’accès avant de continuer")

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

  private

  def validate_revenue_years_selection
    selected_years = %w[
    dgfip_annee_n_moins_1 dgfip_annee_n_moins_2 dgfip_annee_n_moins_3
    dgfip_annee_n_moins_2_si_indispo_n_moins_1
    ]

    return unless (scopes & selected_years).empty?

    errors.add(:scopes, :invalid, message: "Vous devez cocher au moins une année de revenus souhaitée avant de continuer")
  end

  def validate_incompatible_scopes(incompatible_scopes)
    special_scopes = %w[
    dgfip_annee_n_moins_2_si_indispo_n_moins_1 dgfip_annee_df_au_3112_si_deces_ctb_mp
    ]

    return unless (scopes & special_scopes).present? && (scopes & incompatible_scopes).present?

    errors.add(:scopes, :invalid, message: "Des données incompatibles entre elles ont été cochées. Pour connaître les modalités d’appel et de réponse de l’API Impôt particulier ainsi que les données proposées, vous pouvez consulter le guide de présentation de cette API dans la rubrique « Les données nécessaires > Comment choisir les données »")

  end

  def validate_exclusive_years_scope_combination
    if (scopes & %w[dgfip_annee_n_moins_2_si_indispo_n_moins_1]).present? &&
       (scopes & %w[dgfip_annee_n_moins_1 dgfip_annee_n_moins_2 dgfip_annee_n_moins_3]).present?
      errors.add(:scopes, :invalid, message: "Vous ne pouvez pas sélectionner la donnée 'avant dernière année de revenu, si la dernière année de revenu est indisponible' avec d'autres années de revenus")
    end
  end
end
