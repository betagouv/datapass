class DeleteLegacyModels < ActiveRecord::Migration[5.1]
  def change
    drop_table :scopes
    drop_table :resource_providers
  end
end
