class Enrollment::Dgfip::SandboxEnrollment < Enrollment
  protected

  def submit_validation
    super

    responsable_technique_validation
  end
end
