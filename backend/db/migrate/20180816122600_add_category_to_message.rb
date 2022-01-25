class AddCategoryToMessage < ActiveRecord::Migration[5.1]
  def change
    add_column :messages, :category, :integer
  end
end
