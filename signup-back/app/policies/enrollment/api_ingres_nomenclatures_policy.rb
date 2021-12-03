class Enrollment::ApiIngresNomenclaturesPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :donnees_ingres_nomenclatures
      ]
    ])

    res
  end
end
