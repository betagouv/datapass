class Enrollment::ApiR2pSandboxPolicy < Enrollment::Dgfip::SandboxPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :dgfip_acces_etat_civil_restitution_spi,
        :dgfip_acces_spi,
        :dgfip_acces_etat_civil_et_adresse,
        :dgfip_acces_etat_civil
      ]
    ])

    res
  end
end
