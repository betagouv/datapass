class Organization < ApplicationRecord
  validates :siret, presence: true, uniqueness: true, siret: true

  has_and_belongs_to_many :users

  def self.find_by_mon_compte_pro_id(mon_compte_pro_id)
    where("mon_compte_pro_payload->>'id' = (?)", mon_compte_pro_id.to_s).first
  end
end
