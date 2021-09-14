class ChangeRoleToTolesInEnrollments < ActiveRecord::Migration[5.1]
  def change
    rename_column :users, :role, :roles
    change_column :users, :roles, "character varying[] USING array[roles]", default: []
  end
end
