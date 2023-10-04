class Enrollment::ApiIndemnitesJournalieresCnam < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence

  protected

  def submit_validation
    super

    previous_enrollment_id_validation
    responsable_technique_validation
  end
end
