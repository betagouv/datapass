class AddAdditionalContentToEnrollements < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :additional_content, :jsonb, default: {}
    remove_column :enrollments, :nombre_demandes_annuelle
    remove_column :enrollments, :pic_demandes_par_seconde
    remove_column :enrollments, :nombre_demandes_mensuelles_jan
    remove_column :enrollments, :nombre_demandes_mensuelles_fev
    remove_column :enrollments, :nombre_demandes_mensuelles_mar
    remove_column :enrollments, :nombre_demandes_mensuelles_avr
    remove_column :enrollments, :nombre_demandes_mensuelles_mai
    remove_column :enrollments, :nombre_demandes_mensuelles_jui
    remove_column :enrollments, :nombre_demandes_mensuelles_jul
    remove_column :enrollments, :nombre_demandes_mensuelles_aou
    remove_column :enrollments, :nombre_demandes_mensuelles_sep
    remove_column :enrollments, :nombre_demandes_mensuelles_oct
    remove_column :enrollments, :nombre_demandes_mensuelles_nov
    remove_column :enrollments, :nombre_demandes_mensuelles_dec
    remove_column :enrollments, :autorite_homologation_nom
    remove_column :enrollments, :autorite_homologation_fonction
    remove_column :enrollments, :date_homologation
    remove_column :enrollments, :date_fin_homologation
    remove_column :enrollments, :autorite_certification
    remove_column :enrollments, :ips_de_production
    remove_column :enrollments, :recette_fonctionnelle
  end
end

# manual requests were made after this migration:
#
#  UPDATE enrollments SET donnees = donnees - 'dgfip_data_years';
#  UPDATE enrollments SET donnees = donnees - 'rgpd_general_agreement';
# UPDATE enrollments
# SET additional_content = additional_content
#     || jsonb_build_object('has_alternative_authentication_methods', donnees->'has_alternative_authentication_methods')
# WHERE fournisseur_de_donnees = 'franceconnect';
# UPDATE enrollments SET donnees = donnees - 'has_alternative_authentication_methods';
#
#  SELECT jsonb_object_keys(donnees) AS key, count(*) FROM enrollments GROUP BY key;
#  SELECT jsonb_object_keys(additional_content) AS key, count(*) FROM enrollments GROUP BY key;
