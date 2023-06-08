class RenameApiEntrepriseScopesInEnrollments < ActiveRecord::Migration[7.0]
  def up
    Enrollment.find_each do |enrollment|
      scopes = enrollment.scopes.map do |scope|
        case scope
        when "associations"
          "open_data"
        when "associations_donnees_protegees"
          "associations_djepva"
        when "attestations_fiscales"
          "attestation_fiscale_dgfip"
        when "attestations_sociales"
          "attestation_sociale_urssaf"
        when "bilans_entreprise_bdf"
          "bilans_bdf"
        when "fntp_carte_pro"
          "open_data"
        when "certificat_cnetp"
          "certification_cnetp"
        when "msa_cotisations"
          "cotisations_msa"
        when "certificat_opqibi"
          "certification_opqibi"
        when "probtp"
          "cotisations_probtp"
        when "qualibat"
          "open_data"
        when "certificat_rge_ademe"
          "open_data"
        when "exercices"
          "chiffre_affaires_dgfip"
        when "extrait_court_inpi"
          "open_data"
        when "extraits_rcs"
          "open_data"
        when "entreprises"
          "mandataires_sociaux_infogreffe"
        when "etablissements"
          "open_data" && "unites_legales_etablissements_insee"
        when "liasse_fiscale"
          "liasses_fiscales_dgfip"
        when "actes_inpi"
          "open_data"
        when "bilans_inpi"
          "comptes_annuels_inpi"
        when "conventions_collectives"
          "open_data"
        when "entreprises_artisanales"
          "open_data"
        when "eori_douanes"
          "open_data"
        when "certificat_agence_bio"
          "open_data"
        else
          scope
        end
      end

      Enrollment.where(target_api: "api_entreprise").update_all(scopes: scopes)
    end
  end

  def down
    Enrollment.find_each do |enrollment|
      scopes = enrollment.scopes.map do |scope|
        case scope
        when "associations_djepva"
          "associations_donnees_protegees"
        when "attestation_fiscale_dgfip"
          "attestations_fiscales"
        when "attestation_sociale_urssaf"
          "attestations_sociales"
        when "bilans_bdf"
          "bilans_entreprise_bdf"
        when "certification_cnetp"
          "certificat_cnetp"
        when "cotisations_msa"
          "msa_cotisations"
        when "certification_opqibi"
          "certificat_opqibi"
        when "cotisations_probtp"
          "probtp"
        when "chiffre_affaires_dgfip"
          "exercices"
        when "mandataires_sociaux_infogreffe"
          "entreprises"
        when "open_data" && "unites_legales_etablissements_insee"
          "etablissements"
        when "liasses_fiscales_dgfip"
          "liasse_fiscale"
        when "comptes_annuels_inpi"
          "bilans_inpi"
        when "open_data"
          "associations" && "fntp_carte_pro" && "qualibat" && "certificat_rge_ademe" && "extrait_court_inpi" && "extraits_rcs" && "actes_inpi" && "conventions_collectives" && "entreprises_artisanales" && "eori_douanes" && "certificat_agence_bio"
        else
          scope
        end
      end

      Enrollment.where(target_api: "api_entreprise").update_all(scopes: scopes)
    end
  end
end
