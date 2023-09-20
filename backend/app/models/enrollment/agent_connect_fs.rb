class Enrollment::AgentConnectFs < Enrollment
  protected

  def submit_validation
    super

    scopes_validation
    responsable_technique_validation
    unless additional_content&.fetch("accept_agentconnect_implementation_alternative", false)&.present?
      errors.add(:additional_content, :invalid, message: "Vous devez attester que votre service propose une alternative à la connexion avec AgentConnect")
    end
  end
end
