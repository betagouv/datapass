class AddNodeExampleToScopes < ActiveRecord::Migration[5.1]
  def change
    add_column :scopes, :node_example, :string
  end
end
