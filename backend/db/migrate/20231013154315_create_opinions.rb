class CreateOpinions < ActiveRecord::Migration[7.0]
  def change
    create_table :opinions do |t|
      t.text :content, null: false
      t.references :enrollment, null: false, foreign_key: true
      t.boolean :open, default: true, null: false

      t.timestamps
    end
  end
end
