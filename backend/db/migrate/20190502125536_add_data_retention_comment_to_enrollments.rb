class AddDataRetentionCommentToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :data_retention_comment, :string
  end
end
