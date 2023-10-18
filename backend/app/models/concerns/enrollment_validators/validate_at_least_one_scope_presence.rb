module EnrollmentValidators::ValidateAtLeastOneScopePresence
  extend ActiveSupport::Concern

  protected

  def submit_validation
    super

    validate_at_least_one_scope_is_present
  end

  def validate_at_least_one_scope_is_present
    if scopes.empty?
      errors.add(:scopes, :invalid, message: no_scopes_present_error_message)
    end
  end

  def no_scopes_present_error_message
    "Vous devez cocher au moins un périmètre de données avant de continuer"
  end
end
