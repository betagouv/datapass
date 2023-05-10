class Enrollment::UniquePolicy < Enrollment::SandboxPolicy
  def notify?
    false
  end

  def permitted_attributes
    res = super

    res.concat([
      additional_content: super_additional_content(res) + [
        :autorite_homologation_nom,
        :autorite_homologation_fonction,
        :date_homologation,
        :date_fin_homologation,
        :volumetrie_appels_par_minute
      ]
    ])

    res
  end
end
