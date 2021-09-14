FactoryBot.define do
  factory :enrollment_email_template do
    action_name { "review_application" }
    sender_email { generate(:email) }
    user_email { generate(:email) }
    subject { "a subject" }
    plain_text_content { "Hello world!" }
  end
end
