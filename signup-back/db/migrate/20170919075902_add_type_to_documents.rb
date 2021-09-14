# frozen_string_literal: true

class AddTypeToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :type, :string
  end
end
