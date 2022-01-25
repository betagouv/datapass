class NewContractualizationForm < ActiveRecord::Migration[5.1]
  def change
    drop_table :enrollments

    create_table :enrollments do |t|
      t.json :scopes
      t.column :contacts, "json[]"
      t.string :siren
      t.json :demarche
      t.json :donnees
      t.string :state
      t.boolean :validation_de_convention
      t.boolean :validation_delegue_a_la_protection_des_données
    end
  end
end
