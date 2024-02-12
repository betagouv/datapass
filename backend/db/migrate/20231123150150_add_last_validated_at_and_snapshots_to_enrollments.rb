class AddLastValidatedAtAndSnapshotsToEnrollments < ActiveRecord::Migration[7.0]
  def up
    add_column :enrollments, :last_validated_at, :datetime

    Enrollment.where(status: "validated").update_all("last_validated_at = updated_at")

    print "Please run specific migration to create snapshots for each validated enrollment: https://gist.github.com/skelz0r/f0124ebff0922f6d6eb209ee50dbbbf9\n"
  end

  def down
    remove_column :enrollments, :last_validated_at, :datetime
  end
end
