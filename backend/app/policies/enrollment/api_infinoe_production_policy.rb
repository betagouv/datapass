class Enrollment::ApiInfinoeProductionPolicy < Enrollment::ProductionPolicy
  def permitted_attributes
    res = []

    res.concat([
      :cgu_approved,
      :dpo_is_informed,
      :target_api,
      :previous_enrollment_id,
      :fondement_juridique_title,
      :fondement_juridique_url,
      team_members_attributes: [:id, :type, :family_name, :given_name, :email, :phone_number, :job],
      documents_attributes: [
        :id,
        :attachment,
        :type,
        :_destroy
      ],
      additional_content: [
        :recette_fonctionnelle,
        :volumetrie_appels_par_minute
      ]
    ])

    res
  end
end
