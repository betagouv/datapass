class Enrollment::ApiIngresNoyauPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :donnees_ingres_noyau
      ]
    ])

    res
  end
end
