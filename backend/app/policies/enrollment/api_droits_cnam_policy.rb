class Enrollment::ApiDroitsCnamPolicy < EnrollmentPolicy
  def permitted_attributes
    res = super

    res.concat([
      scopes: [
        :cnam_beneficiaires,
        :cnam_contrats,
        :cnam_caisse,
        :cnam_exonerations,
        :cnam_medecin_traitant,
        :cnam_presence_medecin_traitant
      ]
    ])

    res
  end
end
