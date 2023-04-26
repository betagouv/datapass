# frozen_string_literal: true

class Enrollment::ApiEntreprisePolicy < EnrollmentPolicy
  def revoke?
    record.can_revoke_status? && (user.is_administrator? || user.is_instructor?(record.target_api))
  end

  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :unites_legales_etablissements_insee
        :associations_djepva
        :effectifs_urssaf
        :mandataires_sociaux_infogreffe
        :chiffre_affaires_dgfip
        :comptes_annuels_inpi
        :bilans_bdf
        :liasses_fiscales_dgfip
        :attestation_fiscale_dgfip
        :attestation_sociale_urssaf
        :cotisations_msa
        :cotisations_probtp
        :certification_cnetp
        :open_data
      ]
    ])

    res
  end
end
