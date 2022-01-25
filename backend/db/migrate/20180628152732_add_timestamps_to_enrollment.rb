class AddTimestampsToEnrollment < ActiveRecord::Migration[5.1]
  def change
    add_timestamps :enrollments, default: DateTime.now
    change_column_default :enrollments, :created_at, nil
    change_column_default :enrollments, :updated_at, nil
  end
end
