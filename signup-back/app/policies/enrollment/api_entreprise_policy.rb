class Enrollment::ApiEntreprisePolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :associations,
        :attestations_agefiph,
        :attestations_fiscales,
        :attestations_sociales,
        :bilans_entreprise_bdf,
        :fntp_carte_pro,
        :certificat_cnetp,
        :msa_cotisations,
        :certificat_opqibi,
        :probtp,
        :qualibat,
        :certificat_rge_ademe,
        :documents_association,
        :exercices,
        :extrait_court_inpi,
        :extraits_rcs,
        :entreprises,
        :etablissements,
        :liasse_fiscale,
        :actes_inpi,
        :bilans_inpi,
        :conventions_collectives,
        :effectifs_acoss,
        :entreprises_artisanales,
        :eori_douanes,
        :certificat_agence_bio
      ],
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job]
    ])

    res
  end
end
