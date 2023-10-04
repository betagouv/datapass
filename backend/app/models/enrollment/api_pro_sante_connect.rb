class Enrollment::ApiProSanteConnect < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence

  protected

  def submit_validation
    super

    responsable_technique_validation
  end
end
