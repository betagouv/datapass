class Enrollment::ApiStatutEtudiantPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :ine,
        :identite,
        :inscription_statut_etudiant,
        :inscription_autre_statuts,
        :admission,
        :etablissement
      ]
    ])

    res
  end
end
