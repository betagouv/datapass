class RemoveAuthenticationTokenFromUsers < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :authentication_token
  end
end
