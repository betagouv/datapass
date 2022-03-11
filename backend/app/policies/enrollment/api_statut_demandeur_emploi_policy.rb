class Enrollment::ApiStatutDemandeurEmploiPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :'api_fc-liste-paiementsv1'
      ]
    ])

    res
  end
end
