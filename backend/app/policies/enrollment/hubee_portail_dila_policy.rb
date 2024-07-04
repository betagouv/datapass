class Enrollment::HubeePortailDilaPolicy < EnrollmentPolicy
  def revoke?
    record.can_revoke_status? && (user.is_administrator? || user.is_instructor?(record.target_api))
  end

  def permitted_attributes
    res = []

    res.concat([
      :target_api,
      :organization_id,
      :intitule,
      :cgu_approved,
      :dpo_is_informed,
      scopes: [
        :EtatCivil,
        :depotDossierPACS,
        :recensementCitoyen,
        :HebergementTourisme,
        :JeChangeDeCoordonnees
      ],
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job]
    ])

    res
  end
end
