class AddCopiedFromEnrollmentRefToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_reference :enrollments, :copied_from_enrollment, references: :enrollments, index: true
    add_foreign_key :enrollments, :enrollments, column: :copied_from_enrollment_id
  end
end
