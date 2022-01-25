class AddDpoIsInformedToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :dpo_is_informed, :boolean
  end
end
