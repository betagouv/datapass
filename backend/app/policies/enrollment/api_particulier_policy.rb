class Enrollment::ApiParticulierPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: record.configuration["scopesConfiguration"].map { |scope| scope["value"].to_sym }
    ])

    res
  end
end
