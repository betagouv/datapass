class RemoveFournisseurDeServiceFromEnrollments < ActiveRecord::Migration[5.1]
  def change
    remove_column :enrollments, :fournisseur_de_service
    add_column :enrollments, :linked_franceconnect_enrollment_id, :integer
  end
end
