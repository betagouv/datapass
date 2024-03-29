class Event < ApplicationRecord
  VALID_NAMES = %w[
    create
    update_contacts
    update
    archive
    request_changes
    notify
    submit
    import
    validate
    copy
    refuse
    revoke
    reminder
    reminder_before_archive

    reopen

    opinion_created
    opinion_comment_created
  ].freeze
  EVENTS_WITH_COMMENT_AS_EMAIL_BODY = %w[refuse request_changes validate revoke].freeze

  belongs_to :enrollment
  belongs_to :entity, polymorphic: true, optional: true

  belongs_to :user, optional: true
  validates :user, presence: true, if: proc { |event| %w[reminder reminder_before_archive archive].exclude?(event.name) }

  validates :name, presence: true, inclusion: {in: VALID_NAMES}

  validate :validate_comment
  validate :entity_presence

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

  private

  def mark_as_notify_from_demandeur
    if name == "notify"
      demandeurs_ids = enrollment.demandeurs.pluck(:user_id)
      if demandeurs_ids.include?(user.id)
        self.is_notify_from_demandeur = true
      end
    end
  end

  def entity_presence
    return if name.blank?

    if name.start_with?("opinion_comment_")
      errors.add(:entity, "doit être un commentaire d'avis") unless entity.is_a?(OpinionComment)
    elsif name.start_with?("opinion_")
      errors.add(:entity, "doit être un avis") unless entity.is_a?(Opinion)
    end
  end
end
