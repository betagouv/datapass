class AddUniqueConstraintToUsers < ActiveRecord::Migration[5.1]
  def change
    add_index :users, :email, unique: true
    add_index :users, :uid, unique: true
  end
end
