class Enrollment::ApiImpotParticulierFcSandbox < Enrollment::SandboxEnrollment
  protected

  def submit_validation
    super

    previous_enrollment_id_validation

    if (scopes & %w[dgfip_annee_n_moins_1 dgfip_annee_n_moins_2 dgfip_annee_n_moins_3 dgfip_annee_n_moins_2_si_indispo_n_moins_1]).empty?
      errors.add(:scopes, :invalid, message: "Vous devez cocher au moins une année de revenus souhaitée avant de continuer")
    end
  end
end
