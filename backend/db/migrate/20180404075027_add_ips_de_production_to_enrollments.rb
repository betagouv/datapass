class AddIpsDeProductionToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :ips_de_production, :string
  end
end
