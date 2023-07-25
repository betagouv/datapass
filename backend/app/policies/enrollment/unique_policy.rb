class Enrollment::UniquePolicy < Enrollment::SandboxPolicy
  def notify?
    false
  end

  def permitted_attributes
    augment_permitted_attributes(super, :additional_content, :autorite_homologation_nom, :autorite_homologation_fonction, :date_homologation, :date_fin_homologation, :volumetrie_appels_par_minute)
  end
end
