class AddServicesToScopes < ActiveRecord::Migration[5.1]
  def change
    add_column :scopes, :services, "json[]", default: []
  end
end
