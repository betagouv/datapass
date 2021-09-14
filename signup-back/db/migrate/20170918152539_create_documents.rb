# frozen_string_literal: true

class CreateDocuments < ActiveRecord::Migration[5.1]
  def change
    create_table :documents do |t|
      t.string :attachment

      t.timestamps
    end
  end
end
