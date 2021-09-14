class AddTypeFournisseurDonneesToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :type_fournisseur_donnees, :string
  end
end
