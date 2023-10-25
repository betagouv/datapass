class Opinion < ApplicationRecord
  belongs_to :enrollment, required: true
  belongs_to :reporter, class_name: "User", required: true

  validates :open, inclusion: {in: [true, false]}
  validates :content, presence: true
  validates :enrollment, presence: true

  has_many :comments, class_name: "OpinionComment", dependent: :destroy

  validate :only_one_open_opinion_per_enrollment
  validate :enrollment_reporter_is_valid

  def closed?
    !open
  end

  def only_one_open_opinion_per_enrollment
    return unless open

    if enrollment.opinions.where(open: true).any?
      errors.add(:base, "ne peut pas avoir 2 avis ouverts pour la même demande")
    end
  end

  def enrollment_reporter_is_valid
    return unless reporter
    return unless enrollment
    return if reporter.is_reporter?(enrollment)

    errors.add(:reporter, "n'est pas autorisé à donner un avis sur cette demande")
  end
end
