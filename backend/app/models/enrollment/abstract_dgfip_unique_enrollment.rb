class Enrollment::AbstractDgfipUniqueEnrollment < Enrollment::AbstractDgfipSandboxEnrollment
  protected

  def submit_validation
    super

    production_form_validation
  end
end
