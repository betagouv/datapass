class RemoveValidationDeDelegueALaProtectionDesDonnees < ActiveRecord::Migration[5.1]
  def change
    remove_column :enrollments, :validation_delegue_a_la_protection_des_donnees
  end
end
