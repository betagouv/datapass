class Enrollment::ApiR2pSandboxPolicy < Enrollment::Dgfip::SandboxPolicy
  def permitted_attributes
    res = super

    res.concat([
      additional_content: [
        :rgpd_general_agreement,
        :acces_etat_civil_restitution_spi,
        :acces_spi,
        :acces_etat_civil_et_adresse,
        :acces_etat_civil
      ]
    ])

    res
  end
end
