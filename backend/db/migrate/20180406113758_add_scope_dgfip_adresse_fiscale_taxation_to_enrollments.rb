class AddScopeDgfipAdresseFiscaleTaxationToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :scope_dgfip_adresse_fiscale_taxation, :boolean
  end
end
