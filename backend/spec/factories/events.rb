FactoryBot.define do
  factory :event do
    name { "create" }
    user
    enrollment

    trait :with_user do
      user_id { user.id }
    end

    trait :with_comment do
      comment { "I like turtles" }
    end

    trait :create

    trait :update do
      name { "update" }

      with_user
      with_comment
    end

    trait :submit do
      name { "submit" }

      with_user
    end

    trait :validate do
      name { "validate" }

      with_user
      with_comment
    end

    trait :refuse do
      name { "refuse" }

      with_user
      with_comment
    end

    trait :notify do
      name { "notify" }

      with_user
      with_comment
    end

    trait :request_changes do
      name { "request_changes" }

      with_user
      with_comment
    end

    trait :revoke do
      name { "revoke" }

      with_user
      with_comment
    end

    trait :reminder do
      name { "reminder" }
    end

    trait :delete do
      name { "delete" }

      with_user
    end
  end
end
