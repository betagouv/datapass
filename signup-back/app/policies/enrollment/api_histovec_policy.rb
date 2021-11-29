class Enrollment::ApiHistovecPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :info_vehicule_histovec,
        :historique_vehicule_histovec
      ]
    ])

    res
  end
end
