class AddCertificationAuthorityToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :certification_authority, :string
  end
end
