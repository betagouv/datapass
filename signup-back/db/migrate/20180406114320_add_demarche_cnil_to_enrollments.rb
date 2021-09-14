class AddDemarcheCnilToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :demarche_cnil, :boolean
  end
end
