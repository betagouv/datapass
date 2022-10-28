class Enrollment::ApiParticulierPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: record.configuration["scopes"].map { |scope| scope["value"].to_sym }
    ])

    res
  end
end
