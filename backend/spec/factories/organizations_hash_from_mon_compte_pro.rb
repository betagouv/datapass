FactoryBot.define do
  factory :organization_hash_from_mon_compte_pro, class: Hash do
    initialize_with { attributes.stringify_keys }

    siret { Faker::Company.french_siret_number }
    is_external { true }

    trait :dinum do
      id { 1 }
      siret { "13002526500013" }
      is_external { false }
    end

    trait :clamart do
      id { 2 }
      siret { "21920023500014" }
      is_external { false }
    end

    trait :region_reunion do
      id { 3 }
      siret { "23974001200012" }
      is_external { false }
    end
  end
end
