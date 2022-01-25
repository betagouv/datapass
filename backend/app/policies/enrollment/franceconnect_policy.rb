class Enrollment::FranceconnectPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :family_name,
        :given_name,
        :birthdate,
        :birthplace,
        :birthcountry,
        :gender,
        :preferred_username,
        :email,
        :openid
      ],
      additional_content: [
        :eidas_level,
        :has_alternative_authentication_methods
      ]
    ])

    res
  end
end
