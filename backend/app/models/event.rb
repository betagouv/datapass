class Event < ActiveRecord::Base
  EVENT_NAMES = %w[create update_contacts update request_changes notify submit import validate copy refuse].freeze
  MANUALLY_REVIEWED_EVENT_NAMES = %w[refuse request_changes validate notify].freeze

  belongs_to :enrollment
  belongs_to :user

  validate :validate_comment
  validate :validate_name

  protected

  def validate_comment
    if name.in?(MANUALLY_REVIEWED_EVENT_NAMES) && !comment.present?
      errors.add(:comment, :invalid, message: "Vous devez renseigner un commentaire")
    end
  end

  # We rather use this validation to control the number of events rather than an enum type because it raises:
  # ArgumentError:
  #   You tried to define an enum named "name" on the model "Event", but this will generate a class method "create", which is already defined by Active Record.
  def validate_name
    unless name.in?(EVENT_NAMES)
      errors.add(:name, :invalid, message: "Une erreur inattendue est survenue: nom d’évènement inconnu")
    end
  end
end
