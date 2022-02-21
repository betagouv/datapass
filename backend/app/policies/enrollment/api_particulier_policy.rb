class Enrollment::ApiParticulierPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :dgfip_declarant1_nom,
        :dgfip_declarant1_nom_naissance,
        :dgfip_declarant1_prenoms,
        :dgfip_declarant1_date_naissance,
        :dgfip_declarant2_nom,
        :dgfip_declarant2_nom_naissance,
        :dgfip_declarant2_prenoms,
        :dgfip_declarant2_date_naissance,
        :dgfip_date_recouvrement,
        :dgfip_date_etablissement,
        :dgfip_adresse_fiscale_taxation,
        :dgfip_adresse_fiscale_annee,
        :dgfip_nombre_parts,
        :dgfip_nombre_personnes_a_charge,
        :dgfip_situation_familiale,
        :dgfip_revenu_brut_global,
        :dgfip_revenu_imposable,
        :dgfip_impot_revenu_net_avant_corrections,
        :dgfip_montant_impot,
        :dgfip_revenu_fiscal_reference,
        :dgfip_annee_impot,
        :dgfip_annee_revenus,
        :dgfip_erreur_correctif,
        :dgfip_situation_partielle,
        :cnaf_quotient_familial,
        :cnaf_allocataires,
        :cnaf_enfants,
        :cnaf_adresse,
        :pole_emploi_identite,
        :pole_emploi_contact,
        :pole_emploi_adresse,
        :pole_emploi_inscription,
        :mesri_identifiant,
        :mesri_identite,
        :mesri_inscription_etudiant,
        :mesri_inscription_autre,
        :mesri_admission,
        :mesri_etablissements,
        :cnous_statut_boursier,
        :cnous_echelon_bourse,
        :cnous_email,
        :cnous_periode_versement,
        :cnous_statut_bourse,
        :cnous_ville_etudes,
        :cnous_identite
      ]
    ])

    res
  end
end
