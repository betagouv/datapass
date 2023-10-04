class Enrollment::Franceconnect < Enrollment
  include EnrollmentValidators::ValidateAtLeastOneScopePresence

  protected

  def submit_validation
    super

    responsable_technique_validation
    unless additional_content&.fetch("has_alternative_authentication_methods", false)&.present?
      errors.add(:additional_content, :invalid, message: "Vous devez attester que votre service propose une alternative à la connexion avec FranceConnect")
    end
  end
end
