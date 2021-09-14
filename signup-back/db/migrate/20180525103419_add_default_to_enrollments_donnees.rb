class AddDefaultToEnrollmentsDonnees < ActiveRecord::Migration[5.1]
  def change
    change_column :enrollments, :donnees, :json, default: {destinaires: {}}
  end
end
