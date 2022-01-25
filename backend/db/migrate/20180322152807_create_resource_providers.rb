class CreateResourceProviders < ActiveRecord::Migration[5.1]
  def change
    create_table :resource_providers do |t|
      t.string :short_name
      t.string :long_name
      t.string :description

      t.timestamps
    end
  end
end
