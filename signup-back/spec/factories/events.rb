FactoryBot.define do
  factory :event do
    name { "created" }
    user
    enrollment

    trait :with_comment do
      comment { "I like turtles" }
    end

    trait :created

    trait :updated do
      name { "updated" }

      with_comment
    end

    trait :submitted do
      name { "submitted" }
    end

    trait :validated do
      name { "validated" }

      with_comment
    end

    trait :refused do
      name { "refused" }

      with_comment
    end

    trait :notified do
      name { "notified" }

      with_comment
    end

    trait :asked_for_modification do
      name { "asked_for_modification" }

      with_comment
    end
  end
end
