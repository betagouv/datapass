class AddArchiveToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :archive, :boolean, default: false
  end
end
