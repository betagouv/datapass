FactoryBot.define do
  factory :event do
    name { "create" }
    user
    enrollment

    trait :with_comment do
      comment { "I like turtles" }
    end

    trait :create

    trait :update do
      name { "update" }

      with_comment
    end

    trait :submit do
      name { "submit" }
    end

    trait :validate do
      name { "validate" }

      with_comment
    end

    trait :refuse do
      name { "refuse" }

      with_comment
    end

    trait :notify do
      name { "notify" }

      with_comment
    end

    trait :request_changes do
      name { "request_changes" }

      with_comment
    end

    trait :revoke do
      name { "revoke" }

      with_comment
    end
  end
end
