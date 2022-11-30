FactoryBot.define do
  sequence(:email) { |n| "user#{n}@whatever.gouv.fr" }

  factory :user do
    email

    transient do
      organization_kind { nil }
    end

    after(:build) do |user, evaluator|
      if evaluator.organization_kind
        user.organizations << build(:organization, evaluator.organization_kind)
      end
    end

    trait :administrator do
      roles do
        %w[
          administrator
        ]
      end
    end

    trait :dpo do
      with_personal_information
    end

    trait :responsable_traitement do
      with_personal_information
    end

    trait :with_personal_information do
      given_name { "Jean" }
      family_name { "Dupont" }
      phone_number { "0636656565" }
      job { "Administrateur" }
    end

    trait :with_all_infos do
      with_personal_information
      administrator

      organizations do
        [
          build(:organization, :dinum)
        ]
      end
    end

    trait :instructor do
      transient do
        target_api { "franceconnect" }
      end

      after(:build) do |instructor, evaluator|
        instructor.roles ||= []

        %w[instructor reporter].each do |role|
          instructor.roles << "#{evaluator.target_api}:#{role}"
        end
      end
    end
  end
end
