class CleanEnrollmentMessages < ActiveRecord::Migration[5.1]
  def change
    remove_column :events, :resource_id
    drop_table :users_roles
    drop_table :messages
  end
end
