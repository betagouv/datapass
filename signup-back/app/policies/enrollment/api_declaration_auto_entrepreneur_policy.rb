class Enrollment::ApiDeclarationAutoEntrepreneurPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job]
    ])

    res
  end
end
