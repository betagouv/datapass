class UserEnrollmentListSerializer < ApplicationSerializer
  attributes :id,
    :description,
    :nom_raison_sociale,
    :target_api,
    :status,
    :siret,
    :intitule

  has_many :events

  attribute :acl do
    object.policy.acl_methods.map { |method|
      [method.to_s.delete("?"), object.policy.new(current_user, object).send(method)]
    }.to_h
  end
end
