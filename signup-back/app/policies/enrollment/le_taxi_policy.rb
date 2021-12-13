class Enrollment::LeTaxiPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super
    res.concat([
      scopes: [
        :taxis_management, :hails_management
      ]
    ])

    res
  end
end
