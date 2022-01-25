class Enrollment::ApiPrestationsSocialesPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :beneficiaire_rsa,
        :beneficiaire_css
      ]
    ])

    res
  end
end
