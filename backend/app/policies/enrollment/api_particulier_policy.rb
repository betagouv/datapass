# frozen_string_literal: true

class Enrollment::ApiParticulierPolicy < EnrollmentPolicy
  include PolicyConfigurationFromFile

  def revoke?
    record.can_revoke_status? && (user.is_administrator? || user.is_instructor?(record.target_api))
  end
end
