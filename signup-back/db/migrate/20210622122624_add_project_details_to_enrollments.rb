class AddProjectDetailsToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :type_projet, :string
    add_column :enrollments, :date_mise_en_production, :string
    add_column :enrollments, :volumetrie_approximative, :string
  end
end
