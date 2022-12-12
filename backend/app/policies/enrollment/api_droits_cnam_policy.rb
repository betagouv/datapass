class Enrollment::ApiDroitsCnamPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :droits_assurance_maladie
      ]
    ])

    res
  end
end
