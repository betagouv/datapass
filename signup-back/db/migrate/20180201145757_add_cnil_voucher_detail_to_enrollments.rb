class AddCnilVoucherDetailToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :cnil_voucher_detail, :json, default: {}
  end
end
