class AddEmailVerifiedToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :email_verified, :boolean, default: false
  end
end
