class Enrollment::AbstractDgfipSandboxEnrollment < Enrollment
  include DgfipValidationMethods

  protected

  def submit_validation
    super

    responsable_technique_validation
  end
end
