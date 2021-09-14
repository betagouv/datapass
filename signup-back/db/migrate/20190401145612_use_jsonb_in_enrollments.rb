class UseJsonbInEnrollments < ActiveRecord::Migration[5.1]
  def change
    reversible do |dir|
      dir.up do
        change_column :enrollments, :scopes, "jsonb USING CAST(scopes AS jsonb)", default: {}
        change_column :enrollments, :demarche, "jsonb USING CAST(demarche AS jsonb)"
        change_column :enrollments, :donnees, "jsonb USING CAST(donnees AS jsonb)", default: {destinaires: {}}
      end
      dir.down do
        change_column :enrollments, :scopes, "json USING CAST(scopes AS json)"
        change_column :enrollments, :demarche, "json USING CAST(demarche AS json)"
        change_column :enrollments, :donnees, "json USING CAST(donnees AS json)"
      end
    end
  end
end
