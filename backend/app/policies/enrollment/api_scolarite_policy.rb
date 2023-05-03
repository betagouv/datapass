class Enrollment::ApiScolaritePolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :men_statut_scolarite,
        :men_statut_boursier,
        :men_echelon_bourse
      ]
    ])

    res
  end
end
