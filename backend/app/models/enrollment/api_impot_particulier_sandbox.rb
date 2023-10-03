class Enrollment::ApiImpotParticulierSandbox < Enrollment::SandboxEnrollment
  include RequireRgpdGeneralAgreement

  protected

  def submit_validation
    super

    api_impot_particulier_scope_validation
    api_impot_particulier_acces_validation
  end
end
