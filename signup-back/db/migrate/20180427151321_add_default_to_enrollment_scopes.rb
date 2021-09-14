class AddDefaultToEnrollmentScopes < ActiveRecord::Migration[5.1]
  def change
    change_column :enrollments, :scopes, :json, default: {}
  end
end
