# frozen_string_literal: true

class AddEnrollmentIdToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :enrollment_id, :integer
  end
end
