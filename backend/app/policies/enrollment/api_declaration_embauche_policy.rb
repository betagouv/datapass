class Enrollment::ApiDeclarationEmbauche < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
      ]
    ])

    res
  end
end
