FactoryBot.define do
  factory :opinion_comment do
    content { "This is an opinion, deal with it" }

    transient do
      target_api { :api_particulier }
    end

    after(:build) do |opinion_comment, evaluator|
      opinion_comment.user ||= create(:user, roles: ["#{evaluator.target_api}:reporter"])
      opinion_comment.opinion ||= create(:opinion, enrollment: create(:enrollment, evaluator.target_api))
    end
  end
end
