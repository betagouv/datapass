# frozen_string_literal: true

class CreateEnrollments < ActiveRecord::Migration[5.1]
  def change
    create_table :enrollments do |t|
      t.json :service_provider
      t.json :scopes
      t.json :legal_basis
      t.json :service_description
      t.boolean :agreement
      t.string :state

      t.timestamps
    end
  end
end
