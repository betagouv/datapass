class AddCertificationResultsDetailToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :certification_results_detail, :json, default: {}
  end
end
