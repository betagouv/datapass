class EventSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :name, :comment, :diff

  has_one :user
end
