class Event < ActiveRecord::Base
  belongs_to :enrollment
  belongs_to :user

  validate :validate_comment
  validate :validate_name

  protected

  def validate_comment
    if name.in?(%w[refuse request_changes validate notify]) && !comment.present?
      errors.add(:comment, :invalid, "Vous devez renseigner un commentaire")
    end
  end

  # We rather use this validation to control the number of events rather than an enum type because it raises:
  # ArgumentError:
  #   You tried to define an enum named "name" on the model "Event", but this will generate a class method "create", which is already defined by Active Record.
  def validate_name
    unless name.in?(%w[create update_contacts update request_changes notify submit import validate copy refuse])
      errors.add(:name, :invalid, "Une erreur inattendue est survenue: nom d’évènement inconnu")
    end
  end
end
