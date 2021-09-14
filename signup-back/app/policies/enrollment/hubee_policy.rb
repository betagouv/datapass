class Enrollment::HubeePolicy < EnrollmentPolicy
  def permitted_attributes
    res = []

    res.concat([
      :target_api,
      :organization_id,
      :demarche,
      :intitule,
      :description,
      :fondement_juridique_title,
      :fondement_juridique_url,
      :cgu_approved,
      documents_attributes: [
        :attachment,
        :type
      ],
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job],
      additional_content: [
        :nom_application_metier,
        :nom_editeur,
        :numero_version
      ]
    ])

    res
  end
end
