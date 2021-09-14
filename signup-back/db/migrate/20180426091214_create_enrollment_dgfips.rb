class CreateEnrollmentDgfips < ActiveRecord::Migration[5.1]
  def change
    create_table :enrollment_dgfips do |t|
      t.column :fournisseur_de_donnees, :string
      t.column :fournisseur_de_service, :string
      t.column :description_service, :string
      t.column :fondement_juridique, :string
      t.column :scope_dgfip_RFR, :boolean
      t.column :scope_dgfip_adresse_fiscale_taxation, :boolean
      t.column :nombre_demandes_annuelle, :integer
      t.column :pic_demandes_par_heure, :integer
      t.column :nombre_demandes_mensuelles_jan, :integer
      t.column :nombre_demandes_mensuelles_fev, :integer
      t.column :nombre_demandes_mensuelles_mar, :integer
      t.column :nombre_demandes_mensuelles_avr, :integer
      t.column :nombre_demandes_mensuelles_mai, :integer
      t.column :nombre_demandes_mensuelles_jui, :integer
      t.column :nombre_demandes_mensuelles_jul, :integer
      t.column :nombre_demandes_mensuelles_aou, :integer
      t.column :nombre_demandes_mensuelles_sep, :integer
      t.column :nombre_demandes_mensuelles_oct, :integer
      t.column :nombre_demandes_mensuelles_nov, :integer
      t.column :nombre_demandes_mensuelles_dec, :integer
      t.column :autorite_certification_nom, :string
      t.column :autorite_certification_fonction, :string
      t.column :date_homologation, :date
      t.column :date_fin_homologation, :date
      t.column :delegue_protection_donnees, :string
      t.column :certificat_pub_production, :string
      t.column :autorite_certification, :string
      t.column :ips_de_production, :string
      t.column :mise_en_production, :boolean
      t.column :validation_de_convention, :boolean
      t.column :recette_fonctionnelle, :boolean

      t.column :state, :string
      t.timestamps
    end
  end
end
