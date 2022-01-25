class AddDiffToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :diff, :jsonb
  end
end
