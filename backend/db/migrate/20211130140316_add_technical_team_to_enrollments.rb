class AddTechnicalTeamToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :technical_team_type, :string
    add_column :enrollments, :technical_team_value, :string
  end
end
