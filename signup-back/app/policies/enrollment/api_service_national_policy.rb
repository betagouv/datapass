class Enrollment::ApiServiceNationalPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :en_regle
      ]
    ])

    res
  end
end
