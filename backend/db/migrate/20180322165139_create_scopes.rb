class CreateScopes < ActiveRecord::Migration[5.1]
  def change
    create_table :scopes do |t|
      t.string :name
      t.string :human_name
      t.text :description
      t.integer :resource_provider_id

      t.timestamps
    end
  end
end
