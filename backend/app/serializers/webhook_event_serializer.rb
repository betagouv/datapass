class WebhookEventSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :comment,
    :created_at

  has_one :user, serializer: WebhookUserWithProfileSerializer
end
