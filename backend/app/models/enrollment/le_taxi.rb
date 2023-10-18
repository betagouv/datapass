class Enrollment::LeTaxi < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence

  protected

  def submit_validation
    super

    technical_team_validation
    responsable_technique_validation
  end
end
