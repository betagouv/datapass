class EnrollmentEmailTemplate < ActiveModelSerializers::Model
  attributes :action_name,
    :sender_email,
    :user_email,
    :subject,
    :plain_text_content
end
