class Enrollment::ApiHermesSandbox < Enrollment::SandboxEnrollment
  protected

  def submit_validation
    super

    rgpd_general_agreement_validation
  end
end
