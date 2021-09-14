class AddAttachablePolymorphicAssociationToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :attachable_type, :string
    add_column :documents, :attachable_id, :integer
    remove_column :documents, :dgfip_id, :integer
    remove_column :documents, :enrollment_id, :integer
  end
end
