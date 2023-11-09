class Opinion < ApplicationRecord
  belongs_to :enrollment, required: true

  belongs_to :instructor, class_name: "User", required: true
  belongs_to :reporter, class_name: "User", required: true

  validates :open, inclusion: {in: [true, false]}
  validates :content, presence: true
  validates :enrollment, presence: true

  has_one :comment, class_name: "OpinionComment", dependent: :destroy

  has_many :events, as: :entity, dependent: :destroy

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

  def enrollment_instructor_is_valid
    return unless instructor
    return unless enrollment
    return if instructor.is_instructor?(enrollment.target_api)

    errors.add(:instructor, "n'est pas autorisé à créer un avis pour cette demande")
  end
end
