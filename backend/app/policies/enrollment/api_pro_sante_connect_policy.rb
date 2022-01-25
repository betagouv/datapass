class Enrollment::ApiProSanteConnectPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [:idnat, :donnees_sectorielles]
    ])

    res
  end
end
