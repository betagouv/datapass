class ChangeAutoriteHomologationToAutoriteCertification < ActiveRecord::Migration[5.1]
  def change
    rename_column :enrollments, :autorite_certification_nom, :autorite_homologation_nom
    rename_column :enrollments, :autorite_certification_fonction, :autorite_homologation_fonction
  end
end
