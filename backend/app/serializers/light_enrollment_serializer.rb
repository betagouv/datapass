class LightEnrollmentSerializer < ActiveModel::Serializer
  attributes :id, :updated_at, :nom_raison_sociale, :intitule, :target_api, :status, :demandeurs, :notify_events_from_demandeurs_count, :unprocessed_notify_events_from_demandeurs_count, :zip_code, :consulted_by_instructor

  attribute :acl do
    object.policy.acl_methods.map { |method|
      [method.to_s.delete("?"), object.policy.new(current_user, object).send(method)]
    }.to_h
  end

  def demandeurs
    object.demandeurs.map do |demandeur|
      TeamMemberSerializer.new(demandeur)
    end
  end

  attribute :is_renewal do
    object.copied_from_enrollment_id.present?
  end

  attribute :consulted_by_instructor do
    object.consulted_by_instructor?
  end
end
