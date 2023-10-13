class Opinion < ApplicationRecord
  belongs_to :enrollment, required: true

  validates :open, inclusion: {in: [true, false]}
  validates :content, presence: true
  validates :enrollment, presence: true

  validate :only_one_open_opinion_per_enrollment

  def only_one_open_opinion_per_enrollment
    return unless open

    if enrollment.opinions.where(open: true).any?
      errors.add(:base, "ne peut pas avoir 2 avis ouverts pour la même demande")
    end
  end
end
