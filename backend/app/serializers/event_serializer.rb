# frozen_string_literal: true

class EventSerializer < ApplicationSerializer
  attributes :id,
    :comment,
    :created_at,
    :diff,
    :name,
    :entity_id,
    :entity_type,
    :processed_at,
    :updated_at

  has_one :user
end
