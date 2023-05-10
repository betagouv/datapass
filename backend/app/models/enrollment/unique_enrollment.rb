class Enrollment::UniqueEnrollment < Enrollment::SandboxEnrollment
  protected

  def submit_validation
    super

    production_form_validation
  end
end
