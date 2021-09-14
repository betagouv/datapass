class Enrollment::ApiFicobaSandboxPolicy < Enrollment::Dgfip::SandboxPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :dgfip_ficoba_etat_civil_denomination,
        :dgfip_ficoba_adresse,
        :dgfip_ficoba_compte,
        :dgfip_ficoba_etablissement_bancaire,
        :dgfip_ficoba_date,
        :dgfip_acces_ficoba_iban,
        :dgfip_acces_ficoba_spi,
        :dgfip_acces_ficoba_siren,
        :dgfip_acces_ficoba_personne_physique,
        :dgfip_acces_ficoba_personne_morale
      ]
    ])

    res
  end
end
