class Enrollment::ApiDeclarationCesuPolicy < EnrollmentPolicy
  def notify?
    false
  end

  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :api_cesu050,
        :api_cesu040,
        :api_cesu030,
        :api_cesu031,
        :api_cesu020,
        :api_cesu021,
        :api_cesu010
      ]
    ])

    res
  end
end
