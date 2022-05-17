class Enrollment::AgentConnectFi < Enrollment
  protected

  def submit_validation
    super

    scopes_validation
    responsable_technique_validation
    unless additional_content&.fetch("authorize_access_to_service_providers", false)&.present?
      errors.add(:additional_content, :invalid, message: "Vous devez autoriser les FS à utiliser les données transmises par AgentConnect")
    end
  end
end
