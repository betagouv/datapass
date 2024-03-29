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

    trait :reminder do
      name { "reminder" }
      user { nil }
    end

    trait :reminder_before_archive do
      name { "reminder_before_archive" }
      user { nil }
    end

    trait :archive do
      name { "archive" }
    end

    trait :opinion_created do
      name { "opinion_created" }

      after(:build) do |event|
        event.entity ||= build(:opinion, enrollment: event.enrollment)
      end
    end

    trait :opinion_comment_created do
      name { "opinion_comment_created" }

      transient do
        opinion { nil }
      end

      after(:build) do |event, evaluator|
        opinion = evaluator.opinion || build(:opinion, enrollment: event.enrollment)
        event.entity ||= build(:opinion_comment, opinion:)
      end
    end
  end
end
