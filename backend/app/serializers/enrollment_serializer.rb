class EnrollmentSerializer < ActiveModel::Serializer
  attributes :updated_at, :created_at, :id, :target_api, :previous_enrollment_id, :copied_from_enrollment_id,
    :cgu_approved, :scopes, :team_members, :organization_id, :siret, :nom_raison_sociale, :status, :linked_token_manager_id,
    :additional_content, :intitule, :description, :fondement_juridique_title, :fondement_juridique_url,
    :data_recipients, :data_retention_period, :data_retention_comment, :demarche, :technical_team_type, :technical_team_value, :demandeurs,
    :type_projet, :date_mise_en_production, :volumetrie_approximative, :dpo_is_informed, :notify_events_from_demandeurs_count, :unprocessed_notify_events_from_demandeurs_count, :zip_code, :consulted_by_instructor, :requested_changes_have_been_done

  has_many :team_members, serializer: TeamMemberWithProfileSerializer do
    object.team_members.order(:id)
  end

  has_many :documents
  has_many :events

  attribute :scopes do
    object.scopes.map { |scope| [scope.to_sym, true] }.to_h
  end

  attribute :acl do
    object.policy.acl_methods.map { |method|
      [method.to_s.delete("?"), object.policy.new(current_user, object).send(method)]
    }.to_h
  end

  attribute :consulted_by_instructor do
    object.consulted_by_instructor?
  end

  attribute :requested_changes_have_been_done do
    object.requested_changes_have_been_done?
  end
end
