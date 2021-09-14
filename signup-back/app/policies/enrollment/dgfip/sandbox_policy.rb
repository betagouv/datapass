class Enrollment::Dgfip::SandboxPolicy < EnrollmentPolicy
  def permitted_attributes
    res = []

    res.concat([
      :cgu_approved,
      :target_api,
      :demarche,
      :previous_enrollment_id,
      :organization_id,
      :intitule,
      :description,
      :fondement_juridique_title,
      :fondement_juridique_url,
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job],
      documents_attributes: [
        :attachment,
        :type
      ],
      additional_content: [
        :rgpd_general_agreement
      ]
    ])

    res
  end
end
