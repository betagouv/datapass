class AddUrlFondementJuridiqueToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :url_fondement_juridique, :string
  end
end
