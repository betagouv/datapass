class CreateOrganizations < ActiveRecord::Migration[7.0]
  def change
    create_table :organizations do |t|
      t.string :siret, null: false, index: {unique: true}
      t.jsonb :mon_compte_pro_payload, default: {}
      t.jsonb :insee_payload, default: {}
      t.datetime :last_mon_compte_pro_update_at
      t.datetime :last_insee_update_at

      t.timestamps
    end

    create_table :organizations_users, id: false do |t|
      t.belongs_to :user, null: false, index: true
      t.belongs_to :organization, null: false, index: true
    end
  end
end
