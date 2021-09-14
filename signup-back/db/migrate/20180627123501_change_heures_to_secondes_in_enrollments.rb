class ChangeHeuresToSecondesInEnrollments < ActiveRecord::Migration[5.1]
  def change
    rename_column :enrollments, :pic_demandes_par_heure, :pic_demandes_par_seconde
  end
end
