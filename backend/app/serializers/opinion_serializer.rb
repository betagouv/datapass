class OpinionSerializer < ApplicationSerializer
  attributes :id, :open, :content, :created_at, :updated_at

  belongs_to :reporter
end