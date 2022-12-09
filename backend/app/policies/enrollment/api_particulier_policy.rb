# frozen_string_literal: true

class Enrollment::ApiParticulierPolicy < EnrollmentPolicy
  def revoke?
    record.can_revoke_status? && (user.is_administrator? || user.is_instructor?(record.target_api))
  end

  def permitted_attributes
    res = super

    res.concat([
      scopes: record.configuration["scopesConfiguration"].map { |scope| scope["value"].to_sym }
    ])

    res
  end
end
