class Enrollment::ApiSfipSandbox < Enrollment::AbstractDgfipSandboxEnrollment
  include RequireRgpdGeneralAgreement

  protected

  def submit_validation
    super

    api_impot_particulier_scope_validation
  end
end
