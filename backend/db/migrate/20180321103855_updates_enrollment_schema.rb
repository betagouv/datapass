class UpdatesEnrollmentSchema < ActiveRecord::Migration[5.1]
  def change
    remove_column :enrollments, :scope_RFR
    remove_column :enrollments, :ip_production
    remove_column :enrollments, :mise_en_production

    add_column :enrollments, :scope_dgfip_avis_imposition, :boolean
    add_column :enrollments, :scope_cnaf_attestation_droits, :boolean
    add_column :enrollments, :scope_cnaf_quotient_familial, :boolean
  end
end
