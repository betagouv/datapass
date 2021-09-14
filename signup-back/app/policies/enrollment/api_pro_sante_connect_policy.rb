class Enrollment::ApiProSanteConnectPolicy < EnrollmentPolicy
  def permitted_attributes
    [
      :cgu_approved,
      :target_api,
      :organization_id,
      :intitule,
      :description,
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job],
      scopes: [:idnat, :donnees_sectorielles]
    ]
  end
end
