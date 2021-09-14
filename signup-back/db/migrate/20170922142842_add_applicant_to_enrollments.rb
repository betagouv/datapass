# frozen_string_literal: true

class AddApplicantToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :applicant, :json
  end
end
