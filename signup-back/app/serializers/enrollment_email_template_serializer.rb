class EnrollmentEmailTemplateSerializer < ActiveModel::Serializer
  attributes :action_name,
    :sender_email,
    :user_email,
    :subject,
    :plain_text_content
end
