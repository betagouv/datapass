class Enrollment::ApiDeclarationAutoEntrepreneurPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :api040,
        :api075,
        :api030,
        :api031,
        :api071,
        :api020,
        :api050,
        :api060,
        :api070
      ]
    ])

    res
  end
end
