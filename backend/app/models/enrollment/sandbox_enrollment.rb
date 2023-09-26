class Enrollment::SandboxEnrollment < Enrollment
  include DgfipValidationMethods
  
  protected

  def submit_validation
    super

    responsable_technique_validation
  end
end
