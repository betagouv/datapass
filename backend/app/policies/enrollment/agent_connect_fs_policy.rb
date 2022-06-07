class Enrollment::AgentConnectFsPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :openid,
        :usual_name,
        :given_name,
        :email,
        :uid,
        :phone,
        :siren,
        :siret,
        :organizational_unit,
        :belonging_population,
        :chorusdt
      ],
      additional_content: [
        :acces_rie,
        :acces_internet,
        :accept_agentconnect_implementation_alternative
      ]
    ])

    res
  end
end
