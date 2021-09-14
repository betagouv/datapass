class AddRecetteFonctionnelleToEnrollments < ActiveRecord::Migration[5.1]
  def change
    add_column :enrollments, :recette_fonctionnelle, :boolean
  end
end
