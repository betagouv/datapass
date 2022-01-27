class Enrollment::ApiCaptchetatPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :ensemble_donnees_captchetat
      ]
    ])

    res
  end
end
