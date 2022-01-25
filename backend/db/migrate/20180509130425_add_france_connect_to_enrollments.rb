class AddFranceConnectToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :france_connect, :boolean
  end
end
