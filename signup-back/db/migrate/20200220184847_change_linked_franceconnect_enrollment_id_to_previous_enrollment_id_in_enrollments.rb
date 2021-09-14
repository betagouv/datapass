class ChangeLinkedFranceconnectEnrollmentIdToPreviousEnrollmentIdInEnrollments < ActiveRecord::Migration[5.2]
  def change
    rename_column :enrollments, :linked_franceconnect_enrollment_id, :previous_enrollment_id
    add_foreign_key :enrollments, :enrollments, column: :previous_enrollment_id
  end
end
