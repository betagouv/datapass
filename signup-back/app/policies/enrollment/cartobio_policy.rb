class Enrollment::CartobioPolicy < EnrollmentPolicy
  def permitted_attributes
    res = []

    res.concat([
      :cgu_approved,
      :target_api,
      :organization_id,
      :intitule,
      :description,
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job],
      documents_attributes: [
        :attachment,
        :type
      ],
      additional_content: [
        :location_scopes,
        :secret_statistique_agreement,
        :partage_agreement,
        :protection_agreement,
        :exhaustivite_agreement,
        :information_agreement
      ]
    ])

    res
  end
end
