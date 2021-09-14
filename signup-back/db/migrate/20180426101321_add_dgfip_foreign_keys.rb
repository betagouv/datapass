class AddDgfipForeignKeys < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :dgfip_id, :integer
    add_column :messages, :dgfip_id, :integer
  end
end
