class AddProductionCertificateToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :production_certificate, :string
  end
end
