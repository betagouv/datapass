class AddScopeDgfipRfrToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :scope_dgfip_RFR, :boolean
  end
end
