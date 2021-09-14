class SplitDgfipScopes < ActiveRecord::Migration[5.2]
  def change
    # Convert enrollments where no DGFIP scope is selected
    Enrollment.connection.execute("
      UPDATE enrollments
      SET scopes = scopes || jsonb '{
        \"dgfip_declarant1_nom\": false,
        \"dgfip_declarant1_nom_naissance\": false,
        \"dgfip_declarant1_prenoms\": false,
        \"dgfip_declarant1_date_naissance\": false,
        \"dgfip_declarant2_nom\": false,
        \"dgfip_declarant2_nom_naissance\": false,
        \"dgfip_declarant2_prenoms\": false,
        \"dgfip_declarant2_date_naissance\": false,
        \"dgfip_adresse_fiscale_annee\": false,
        \"dgfip_adresse_fiscale_taxation\": false,
        \"dgfip_annee_impot\": false,
        \"dgfip_annee_revenus\": false,
        \"dgfip_erreur_correctif\": false,
        \"dgfip_situation_partielle\": false,
        \"dgfip_date_recouvrement\": false,
        \"dgfip_date_etablissement\": false,
        \"dgfip_nombre_parts\": false,
        \"dgfip_nombre_personnes_a_charge\": false,
        \"dgfip_situation_familiale\": false,
        \"dgfip_revenu_brut_global\": false,
        \"dgfip_revenu_imposable\": false,
        \"dgfip_impot_revenu_net_avant_corrections\": false,
        \"dgfip_montant_impot\": false,
        \"dgfip_revenu_fiscal_reference\": false
      }' #- '{dgfip_adresse}' #- '{dgfip_avis_imposition}'
      WHERE target_api = 'api_particulier'
      AND scopes->>'dgfip_declarant1_nom' is null
      AND (scopes->>'dgfip_adresse' = 'false' OR scopes->>'dgfip_adresse' is null)
      AND (scopes->>'dgfip_avis_imposition' = 'false' OR scopes->>'dgfip_avis_imposition' is null);
    ")
    # Convert enrollments where "dgfip_avis_imposition" scope is selected
    Enrollment.connection.execute("
      UPDATE enrollments
      SET scopes = scopes || jsonb '{
        \"dgfip_declarant1_nom\": true,
        \"dgfip_declarant1_nom_naissance\": true,
        \"dgfip_declarant1_prenoms\": true,
        \"dgfip_declarant1_date_naissance\": true,
        \"dgfip_declarant2_nom\": true,
        \"dgfip_declarant2_nom_naissance\": true,
        \"dgfip_declarant2_prenoms\": true,
        \"dgfip_declarant2_date_naissance\": true,
        \"dgfip_adresse_fiscale_annee\": true,
        \"dgfip_adresse_fiscale_taxation\": true,
        \"dgfip_annee_impot\": true,
        \"dgfip_annee_revenus\": true,
        \"dgfip_erreur_correctif\": true,
        \"dgfip_situation_partielle\": true,
        \"dgfip_date_recouvrement\": true,
        \"dgfip_date_etablissement\": true,
        \"dgfip_nombre_parts\": true,
        \"dgfip_nombre_personnes_a_charge\": true,
        \"dgfip_situation_familiale\": true,
        \"dgfip_revenu_brut_global\": true,
        \"dgfip_revenu_imposable\": true,
        \"dgfip_impot_revenu_net_avant_corrections\": true,
        \"dgfip_montant_impot\": true,
        \"dgfip_revenu_fiscal_reference\": true
      }' #- '{dgfip_adresse}' #- '{dgfip_avis_imposition}'
      WHERE target_api = 'api_particulier'
      AND scopes->>'dgfip_avis_imposition' = 'true';
    ")
    # Convert enrollments where "dgfip_adresse" scope is selected
    Enrollment.connection.execute("
      UPDATE enrollments
      SET scopes = scopes || jsonb '{
        \"dgfip_declarant1_nom\": true,
        \"dgfip_declarant1_nom_naissance\": true,
        \"dgfip_declarant1_prenoms\": true,
        \"dgfip_declarant1_date_naissance\": true,
        \"dgfip_declarant2_nom\": true,
        \"dgfip_declarant2_nom_naissance\": true,
        \"dgfip_declarant2_prenoms\": true,
        \"dgfip_declarant2_date_naissance\": true,
        \"dgfip_adresse_fiscale_annee\": true,
        \"dgfip_adresse_fiscale_taxation\": true,
        \"dgfip_annee_impot\": true,
        \"dgfip_annee_revenus\": true,
        \"dgfip_erreur_correctif\": true,
        \"dgfip_situation_partielle\": true,
        \"dgfip_date_recouvrement\": false,
        \"dgfip_date_etablissement\": false,
        \"dgfip_nombre_parts\": false,
        \"dgfip_nombre_personnes_a_charge\": false,
        \"dgfip_situation_familiale\": false,
        \"dgfip_revenu_brut_global\": false,
        \"dgfip_revenu_imposable\": false,
        \"dgfip_impot_revenu_net_avant_corrections\": false,
        \"dgfip_montant_impot\": false,
        \"dgfip_revenu_fiscal_reference\": false
      }' #- '{dgfip_adresse}' #- '{dgfip_avis_imposition}'
      WHERE target_api = 'api_particulier'
      AND scopes->>'dgfip_adresse' = 'true'
      AND (scopes->>'dgfip_avis_imposition' = 'false' OR scopes->>'dgfip_avis_imposition' is null);
    ")
  end
end
