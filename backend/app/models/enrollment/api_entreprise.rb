class Enrollment::ApiEntreprise < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence

  protected

  def submit_validation
    super

    technical_team_validation
    team_members_validation("responsable_technique", "contact technique")
    team_members_validation("contact_metier", "contact métier")
  end
end
