class Enrollment::AgentConnectFi < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :usual_name,
        :given_name,
        :email,
        :uid,
        :phone,
        :Siren,
        :Siret,
        :Organizational_unit
      ]
      additional_content: [
        :additional_content.access_rie,
        :additional_content.access_internet,
        :authorize_access_to_service_providers
    ])

    res
  end
end
