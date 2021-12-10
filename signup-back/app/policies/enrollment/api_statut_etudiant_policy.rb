class Enrollment::ApiStatutEtudiantPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :identifiant_national_etudiant,
        :identite_etudiant,
        :inscription_formation_initiale,
        :inscription_formation_continue,
        :admissions_etudiant,
        :etablissements_etudiant
      ]
    ])

    res
  end
end
