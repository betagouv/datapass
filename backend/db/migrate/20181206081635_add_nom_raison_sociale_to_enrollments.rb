class AddNomRaisonSocialeToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :nom_raison_sociale, :string
  end
end
