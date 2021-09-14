# frozen_string_literal: true

class AddUidToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :uid, :string
  end
end
