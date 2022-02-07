class Enrollment::ApiStatutEtudiantBoursierPolicy < EnrollmentPolicy
    def permitted_attributes
      res = super
  
      res.concat([
        scopes: [
          :cnous_statut_boursier,
          :cnous_echelon_bourse,
          :cnous_email,
          :cnous_periode_versement,
          :cnous_statut_bourse,
          :cnous_ville_etude
        ]
      ])
  
      res
    end
  end
  