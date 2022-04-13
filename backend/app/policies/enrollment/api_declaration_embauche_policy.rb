class Enrollment::ApiDeclarationEmbauche < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat

    res
  end
end
