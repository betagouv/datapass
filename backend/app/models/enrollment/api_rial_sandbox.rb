class Enrollment::ApiRialSandbox < Enrollment::AbstractDgfipSandboxEnrollment
  include RequireRgpdGeneralAgreement

  protected

  def submit_validation
    super

    api_rial_access_validation
  end
end
