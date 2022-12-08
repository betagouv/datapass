class AddZipCodeToEnrollments < ActiveRecord::Migration[7.0]
  def change
    add_column :enrollments, :zip_code, :string
  end
end
