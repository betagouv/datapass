class FixFournisseurDonneesName < ActiveRecord::Migration[5.1]
  def change
    rename_column :enrollments, :fournisseur_donnees, :fournisseur_de_donnees
  end
end
