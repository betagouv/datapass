class Enrollment::AgentConnectFiPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
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
        :authorize_access_to_service_providers
      ]
    ])

    res
  end
end
