class Enrollment::ApiStatutEtudiantPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :mesri_identifiant,
        :mesri_inscription_etudiant,
        :mesri_inscription_autre,
        :mesri_admission,
        :mesri_etablissements
      ]
    ])

    res
  end
end
