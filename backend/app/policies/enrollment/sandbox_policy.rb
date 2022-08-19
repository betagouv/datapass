class Enrollment::SandboxPolicy < EnrollmentPolicy
  def notify?
    false
  end

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
