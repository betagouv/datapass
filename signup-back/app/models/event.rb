# frozen_string_literal: true

class Event < ActiveRecord::Base
  belongs_to :enrollment
  belongs_to :user

  validate :validate_comment

  protected

  def validate_comment
    if name.in?(["refused", "asked_for_modification", "validated", "notified"]) && !comment.present?
      errors[:comment] << "Vous devez renseigner un commentaire"
    end
  end
end
