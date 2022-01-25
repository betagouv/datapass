class ChangeEnrollmentSchema < ActiveRecord::Migration[5.1]
  def change
    remove_column :enrollments, :service_provider
    remove_column :enrollments, :scopes
    remove_column :enrollments, :legal_basis
    remove_column :enrollments, :service_description
    remove_column :enrollments, :agreement
    remove_column :enrollments, :applicant
    remove_column :enrollments, :production_certificate
    remove_column :enrollments, :production_ips
    remove_column :enrollments, :certification_authority
    remove_column :enrollments, :cnil_voucher_detail
    remove_column :enrollments, :certification_results_detail

    add_column :enrollments, :fournisseur_de_service, :string
    add_column :enrollments, :description_service, :string
    add_column :enrollments, :fondement_juridique, :string
    add_column :enrollments, :scope_RFR, :boolean
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
    add_column :enrollments, :ip_production, "text[]"
    add_column :enrollments, :mise_en_production, :boolean
    add_column :enrollments, :validation_de_convention, :boolean
  end
end
