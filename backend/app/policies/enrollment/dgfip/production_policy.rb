class Enrollment::Dgfip::ProductionPolicy < EnrollmentPolicy
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
        :attachment,
        :type
      ],
      additional_content: [
        :autorite_homologation_nom,
        :autorite_homologation_fonction,
        :date_homologation,
        :date_fin_homologation,
        :recette_fonctionnelle,
        :volumetrie_appels_par_minute
      ]
    ])

    res
  end
end
