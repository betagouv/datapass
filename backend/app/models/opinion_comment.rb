class OpinionComment < ApplicationRecord
  belongs_to :user
  belongs_to :opinion

  has_one :enrollment, through: :opinion

  validates_uniqueness_of :user_id, scope: :opinion_id
  validates :content, presence: true

  validate :user_is_opinion_reporter

  def user_is_opinion_reporter
    return if user.nil?
    return if user == opinion.reporter

    errors.add(:user, "doit être le rapporteur renseigné sur la demande d'opinion")
  end
end
