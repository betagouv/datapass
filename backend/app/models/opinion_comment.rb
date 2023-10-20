class OpinionComment < ApplicationRecord
  belongs_to :user
  belongs_to :opinion

  has_one :enrollment, through: :opinion

  validates_uniqueness_of :user_id, scope: :opinion_id
  validates :content, presence: true

  validate :user_is_reporter_or_instructor

  def user_is_reporter_or_instructor
    return if user.is_reporter?(enrollment) || user.is_instructor?(enrollment.target_api)

    errors.add(:user, "doit être un reporteur ou un instructeur de la demande")
  end
end
