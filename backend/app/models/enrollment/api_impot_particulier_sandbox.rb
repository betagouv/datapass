class Enrollment::ApiImpotParticulierSandbox < Enrollment::SandboxEnrollment
  protected

  def submit_validation
    super

    api_impot_particulier_scope_validation
    api_impot_particulier_acces_validation
    rgpd_general_agreement_validation
  end
end
