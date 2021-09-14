class AddProductionIpsToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :production_ips, :string
  end
end
