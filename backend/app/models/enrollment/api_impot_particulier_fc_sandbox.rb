class Enrollment::ApiImpotParticulierFcSandbox < Enrollment::SandboxEnrollment
  protected

  def submit_validation
    super

    previous_enrollment_id_validation
    rgpd_general_agreement_validation
    api_impot_particulier_scope_validation
  end
end
