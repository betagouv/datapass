class AddOauthRolesToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :oauth_roles, :string, array: true, default: []
  end
end
