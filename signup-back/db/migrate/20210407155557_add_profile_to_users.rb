class AddProfileToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :family_name, :string
    add_column :users, :given_name, :string
    add_column :users, :phone_number, :string
    add_column :users, :job, :string
  end
end
