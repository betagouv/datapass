class AddDemarcheToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :demarche, :string
  end
end
