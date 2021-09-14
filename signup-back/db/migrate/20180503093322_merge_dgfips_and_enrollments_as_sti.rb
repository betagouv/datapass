class MergeDgfipsAndEnrollmentsAsSti < ActiveRecord::Migration[5.1]
  def change
    drop_table :enrollment_dgfips

    add_column :enrollments, :type, :string
    add_column :enrollments, :fournisseur_de_service, :string
    add_column :enrollments, :description_service, :string
    add_column :enrollments, :fondement_juridique, :string
    add_column :enrollments, :scope_dgfip_RFR, :boolean
    add_column :enrollments, :scope_dgfip_adresse_fiscale_taxation, :boolean
    add_column :enrollments, :nombre_demandes_annuelle, :integer
    add_column :enrollments, :pic_demandes_par_heure, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_jan, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_fev, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_mar, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_avr, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_mai, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_jui, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_jul, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_aou, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_sep, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_oct, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_nov, :integer
    add_column :enrollments, :nombre_demandes_mensuelles_dec, :integer
    add_column :enrollments, :autorite_certification_nom, :string
    add_column :enrollments, :autorite_certification_fonction, :string
    add_column :enrollments, :date_homologation, :date
    add_column :enrollments, :date_fin_homologation, :date
    add_column :enrollments, :delegue_protection_donnees, :string
    add_column :enrollments, :certificat_pub_production, :string
    add_column :enrollments, :autorite_certification, :string
    add_column :enrollments, :ips_de_production, :string
    add_column :enrollments, :mise_en_production, :boolean
    add_column :enrollments, :recette_fonctionnelle, :boolean
  end
end
