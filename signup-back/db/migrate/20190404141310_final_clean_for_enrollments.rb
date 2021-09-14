class FinalCleanForEnrollments < ActiveRecord::Migration[5.1]
  def change
    remove_column :enrollments, :demarche
    remove_column :enrollments, :donnees
    rename_column :enrollments, :state, :status
    rename_column :enrollments, :validation_de_convention, :cgu_approved
    rename_column :enrollments, :fournisseur_de_donnees, :target_api
    rename_column :enrollments, :token_id, :linked_token_manager_id
    change_column :enrollments, :contacts, "jsonb[] USING CAST(contacts AS jsonb[])"
  end
end

# manual requests were made after this migration:
#
# SELECT target_api, COUNT(*) FROM enrollments GROUP BY target_api;
# UPDATE enrollments
# SET target_api = (SELECT replace(target_api, '-', '_'));
