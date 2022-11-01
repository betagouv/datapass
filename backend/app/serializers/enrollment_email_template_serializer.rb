class EnrollmentEmailTemplateSerializer < ActiveModel::Serializer
  attributes :event,
    :sender_email,
    :user_email,
    :subject,
    :plain_text_content,
    :responsable_metier_email,
    :scopes
end
