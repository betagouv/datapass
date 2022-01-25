class Enrollment::AidantsConnectPolicy < EnrollmentPolicy
  def update?
    super || ((record.status_submitted? || record.status_validated?) && user.is_instructor?(record.target_api))
  end

  def permitted_attributes
    res = []

    res.concat([
      :cgu_approved,
      :dpo_is_informed,
      :target_api,
      :organization_id,
      :intitule,
      :description,
      :type_projet,
      :volumetrie_approximative,
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job],
      documents_attributes: [
        :attachment,
        :type
      ],
      additional_content: [
        :organization_address,
        :organization_postal_code,
        :organization_city,
        :organization_website,
        :associated_public_organisation,
        :label_france_services,
        :label_fabrique_territoires,
        :recrutement_conseiller_numerique,
        :participation_reseau,
        :has_professional_contact_only,
        :has_non_elected_contact_only
      ]
    ])

    res
  end
end
