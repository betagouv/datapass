class Enrollment::ApiImpotParticulierSandbox < Enrollment::DgfipDeprecated::SandboxEnrollment
  protected

  def submit_validation
    super

    # Données
    errors[:rgpd_general_agreement] << "Vous devez attester respecter les principes RGPD avant de continuer" unless additional_content&.fetch("rgpd_general_agreement", false)

    unless scopes.any? { |k, v| v && %w[dgfip_annee_n_moins_1 dgfip_annee_n_moins_2 dgfip_annee_n_moins_3].include?(k) }
      errors[:scopes] << "Vous devez cocher au moins une année de revenus souhaitée avant de continuer"
    end
    unless scopes.any? { |k, v| v && %w[dgfip_acces_spi dgfip_acces_etat_civil].include?(k) }
      errors[:scopes] << "Vous devez cocher au moins une modalité d’accès avant de continuer"
    end
  end
end
