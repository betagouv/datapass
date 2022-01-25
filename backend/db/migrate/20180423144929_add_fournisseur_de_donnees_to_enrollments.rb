class AddFournisseurDeDonneesToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :fournisseur_de_donnees, :string
  end
end
