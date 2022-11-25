class Enrollment::ApiImpotParticulierSandbox < Enrollment::SandboxEnrollment
  protected

  def submit_validation
    super

    if (scopes & %w[dgfip_annee_n_moins_1 dgfip_annee_n_moins_2 dgfip_annee_n_moins_3 dgfip_annee_n_moins_2_si_indispo_n_moins_1]).empty?
      errors.add(:scopes, :invalid, message: "Vous devez cocher au moins une année de revenus souhaitée avant de continuer")
    end
    unless additional_content.any? { |k, v| v && %w[acces_spi acces_etat_civil].include?(k) }
      errors.add(:scopes, :invalid, message: "Vous devez cocher au moins une modalité d’accès avant de continuer")
    end
  end
end
