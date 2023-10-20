class CreateOpinionComments < ActiveRecord::Migration[7.0]
  def change
    create_table :opinion_comments do |t|
      t.references :user, null: false, foreign_key: true, index: false
      t.references :opinion, null: false, foreign_key: true, index: true
      t.text :content, null: false

      t.timestamps
    end

    add_index :opinion_comments, [:user_id, :opinion_id], unique: true
  end
end
