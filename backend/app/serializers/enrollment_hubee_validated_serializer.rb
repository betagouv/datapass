class EnrollmentHubeeValidatedSerializer < ActiveModel::Serializer
  attributes :id, :siret, :scopes, :status, :target_api, :updated_at
end
