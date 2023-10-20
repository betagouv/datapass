class Organization < ApplicationRecord
  validates :siret, presence: true, uniqueness: true, siret: true

  has_and_belongs_to_many :users
end
