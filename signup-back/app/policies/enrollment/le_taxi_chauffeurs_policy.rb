class Enrollment::LeTaxiChauffeursPolicy < EnrollmentPolicy
  def permitted_attributes
    res = []

    res.concat([
      :cgu_approved,
      :target_api,
      :previous_enrollment_id,
      :organization_id,
      :intitule,
      :description,
      :data_recipients,
      :data_retention_period,
      :data_retention_comment,
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job],
      additional_content: [
        :solution_logicielle
      ]
    ])

    res
  end
end
