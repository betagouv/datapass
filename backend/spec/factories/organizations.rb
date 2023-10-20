FactoryBot.define do
  factory :organization do
    siret { Faker::Company.french_siret_number }

    last_mon_compte_pro_update_at { DateTime.now }
    last_insee_update_at { DateTime.now }

    after(:build) do |organization|
      organization.insee_payload ||= build(:sirene_service_payload, siret: organization.siret)
      organization.mon_compte_pro_payload ||= build(:organization_hash_from_mon_compte_pro, siret: organization.siret)
    end
  end
end
