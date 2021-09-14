class AddGdprInformationsToEnrollments < ActiveRecord::Migration[5.2]
  def change
    add_column :enrollments, :dpo_given_name, :string
    rename_column :enrollments, :dpo_label, :dpo_family_name
    add_column :enrollments, :dpo_job, :string
    add_column :enrollments, :responsable_traitement_given_name, :string
    rename_column :enrollments, :responsable_traitement_label, :responsable_traitement_family_name
    add_column :enrollments, :responsable_traitement_job, :string
  end
end
