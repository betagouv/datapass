class Enrollment::AgentConnectFsPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :openid,
        :usual_name,
        :given_name,
        :email,
        :siret
      ],
      additional_content: [
        :acces_rie,
        :acces_internet
      ]
    ])

    res
  end
end
