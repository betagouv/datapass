class ChangeSirenInSiret < ActiveRecord::Migration[5.1]
  def change
    rename_column :enrollments, :siren, :siret
  end
end
