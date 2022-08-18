# frozen_string_literal: true

class EventSerializer < ActiveModel::Serializer
  attributes :id, :comment, :created_at, :diff, :name, :processed_at, :updated_at

  has_one :user
end
