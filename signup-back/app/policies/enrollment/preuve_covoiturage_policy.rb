class Enrollment::PreuveCovoituragePolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :operator,
        :territory
      ]
    ])

    res
  end
end
