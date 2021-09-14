class AddOrganizationsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :organizations, :jsonb, array: true, default: []
  end
end
