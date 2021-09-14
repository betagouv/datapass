class RenameDelegueALaProtectionDesDonnees < ActiveRecord::Migration[5.1]
  def change
    rename_column :enrollments, :validation_delegue_a_la_protection_des_données, :validation_delegue_a_la_protection_des_donnees
  end
end
