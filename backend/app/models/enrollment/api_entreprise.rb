class Enrollment::ApiEntreprise < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence

  before_save :sanitize_open_data_scopes

  protected

  def sanitize_open_data_scopes
    return if scopes.blank?

    scopes.reject! { |scope| scope.start_with?("open_data_") }
    scopes << "open_data" unless scopes.include?("open_data")
  end

  def submit_validation
    super

    technical_team_validation
    team_members_validation("responsable_technique", "contact technique")
    team_members_validation("contact_metier", "contact métier")
  end
end
