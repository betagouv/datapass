class CleanUnusedEnrollmentAttributes < ActiveRecord::Migration[5.1]
  def change
    remove_column :enrollments, :type
    remove_column :enrollments, :description_service
    remove_column :enrollments, :fondement_juridique
    remove_column :enrollments, :scope_dgfip_RFR
    remove_column :enrollments, :scope_dgfip_adresse_fiscale_taxation
    remove_column :enrollments, :delegue_protection_donnees
    remove_column :enrollments, :certificat_pub_production
    remove_column :enrollments, :mise_en_production
    remove_column :enrollments, :demarche_cnil
    remove_column :enrollments, :administration
    remove_column :enrollments, :france_connect
    remove_column :enrollments, :autorisation_legale
    remove_column :enrollments, :url_fondement_juridique
  end
end
