class Enrollment::ApiIndemnitesJournalieresCnamPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :cnam_PaiementIndemnitesJournalieres
      ]
    ])

    res
  end
end
