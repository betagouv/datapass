class AddLastValidatedAtAndSnapshotsToEnrollments < ActiveRecord::Migration[7.0]
  def up
    add_column :enrollments, :last_validated_at, :datetime

    Enrollment.where(status: "validated").update_all("last_validated_at = updated_at")
    Enrollment.where(status: "validated").find_each do |enrollment|
      enrollment.snapshot!
    end
  end

  def down
    remove_column :enrollments, :last_validated_at, :datetime
  end
end
