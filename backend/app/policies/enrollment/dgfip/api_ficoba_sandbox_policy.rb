class Enrollment::ApiFicobaSandboxPolicy < Enrollment::Dgfip::SandboxPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :dgfip_ficoba_etat_civil_denomination,
        :dgfip_ficoba_adresse,
        :dgfip_ficoba_compte,
        :dgfip_ficoba_etablissement_bancaire,
        :dgfip_ficoba_date
      ],
      additional_content: [
        :rgpd_general_agreement,
        :acces_ficoba_iban,
        :acces_ficoba_spi,
        :acces_ficoba_siren,
        :acces_ficoba_personne_physique,
        :acces_ficoba_personne_morale
      ]
    ])

    res
  end
end
