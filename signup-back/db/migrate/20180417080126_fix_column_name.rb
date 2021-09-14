class FixColumnName < ActiveRecord::Migration[5.1]
  def change
    rename_column :enrollments, :type_fournisseur_donnees, :fournisseur_donnees
  end
end
