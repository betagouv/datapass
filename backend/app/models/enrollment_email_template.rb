class EnrollmentEmailTemplate < ActiveModelSerializers::Model
  attributes :event,
    :sender_email,
    :user_email,
    :subject,
    :plain_text_content
end
