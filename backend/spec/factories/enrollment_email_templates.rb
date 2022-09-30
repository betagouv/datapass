FactoryBot.define do
  factory :enrollment_email_template do
    event { "request_changes" }
    sender_email { generate(:email) }
    user_email { generate(:email) }
    subject { "a subject" }
    plain_text_content { "Hello world!" }
    responsable_metier_email { generate(:email) }
  end
end
