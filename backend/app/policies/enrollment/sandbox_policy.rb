class Enrollment::SandboxPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      additional_content: [
        :rgpd_general_agreement
      ]
    ])

    res
  end
end
