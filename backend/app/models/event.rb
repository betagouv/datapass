class Event < ActiveRecord::Base
  EVENT_NAMES = %w[create update_contacts update request_changes notify submit import validate copy refuse revoke reminder delete].freeze
  EVENTS_WITH_COMMENT_AS_EMAIL_BODY = %w[refuse request_changes validate revoke].freeze

  belongs_to :enrollment

  belongs_to :user, optional: true
  validates :user, presence: true, if: proc { |event| event.name != "reminder" }

  validate :validate_comment
  validate :validate_name

  before_create :mark_as_notify_from_demandeur

  def mark_as_processed
    update!(processed_at: Time.now)
  end

  protected

  def validate_comment
    if (name.in?(EVENTS_WITH_COMMENT_AS_EMAIL_BODY) || name == "notify") && !comment.present?
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

  private

  def mark_as_notify_from_demandeur
    demandeurs_ids = enrollment.demandeurs.pluck(:user_id)
    if demandeurs_ids.include?(user.id) && name == "notify"
      self.is_notify_from_demandeur = true
    end
  end
end
