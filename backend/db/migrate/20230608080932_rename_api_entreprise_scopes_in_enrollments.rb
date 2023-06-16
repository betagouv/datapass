class RenameApiEntrepriseScopesInEnrollments < ActiveRecord::Migration[7.0]
  def up
    valid_enrollments.find_each do |enrollment|
      scopes = enrollment.scopes.map do |scope|
        case scope
        when "associations"
          "open_data"
        when "associations_donnees_protegees"
          "associations_djepva"
        when "attestations_agefiph"
          "attestations_agefiph"
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
          "open_data"
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
          ["open_data", "mandataires_sociaux_infogreffe", "unites_legales_etablissements_insee"]
        when "etablissements"
          ["open_data", "unites_legales_etablissements_insee"]
        when "liasse_fiscale"
          "liasses_fiscales_dgfip"
        when "actes_inpi"
          "open_data"
        when "bilans_inpi"
          "comptes_annuels_inpi"
        when "conventions_collectives"
          "open_data"
        when "effectifs_acoss"
          "effectifs_urssaf"
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

      scopes << "open_data"

      begin
        enrollment.update!(scopes: scopes.flatten.compact.uniq)
      rescue ActiveRecord::RecordInvalid
        print "Enrollment #{enrollment.id} could not be updated: #{enrollment.errors.full_messages}\n"
      end
    end
  end

  def down
    valid_enrollments.find_each do |enrollment|
      scopes = enrollment.scopes.map do |scope|
        case scope
        when "unites_legales_etablissements_insee"
          ["entreprises", "etablissements"]
        when "associations_djepva"
          "associations_donnees_protegees"
        when "mandataires_sociaux_infogreffe"
          "entreprises"
        when "chiffre_affaires_dgfip"
          "exercices"
        when "comptes_annuels_inpi"
          "bilans_inpi"
        when "bilans_bdf"
          "bilans_entreprise_bdf"
        when "liasses_fiscales_dgfip"
          "liasse_fiscale"
        when "attestation_fiscale_dgfip"
          "attestations_fiscales"
        when "attestation_sociale_urssaf"
          "attestations_sociales"
        when "cotisations_msa"
          "msa_cotisations"
        when "cotisations_probtp"
          "probtp"
        when "certification_cnetp"
          "certificat_cnetp"
        when "open_data"
          [
            "associations",
            "fntp_carte_pro",
            "qualibat",
            "certificat_rge_ademe",
            "extrait_court_inpi",
            "extraits_rcs",
            "actes_inpi",
            "conventions_collectives",
            "entreprises_artisanales",
            "eori_douanes",
            "certificat_agence_bio",
            "certificat_opqibi"
          ]
        when "attestations_agefiph"
          "attestations_agefiph"
        else
          scope
        end
      end

      begin
        enrollment.update!(scopes: scopes.flatten.compact.uniq)
      rescue ActiveRecord::RecordInvalid
        print "Enrollment #{enrollment.id} could not be updated: #{enrollment.errors.full_messages}\n"
      end
    end
  end

  private

  def valid_enrollments
    Enrollment.where(target_api: "api_entreprise").where("scopes is not null and id not in (?)", enrollement_without_organization_ids)
  end

  def enrollement_without_organization_ids
    [
      10794
    ]
  end
end
