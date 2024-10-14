class Enrollment::AgentConnectFi < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence

  protected

  def submit_validation
    super

    responsable_technique_validation
    unless additional_content&.fetch("authorize_access_to_service_providers", false)&.present?
      errors.add(:additional_content, :invalid, message: "Vous devez autoriser les FS à utiliser les données transmises par ProConnect")
    end
  end
end
