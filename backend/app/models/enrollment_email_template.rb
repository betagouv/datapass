class EnrollmentEmailTemplate < ActiveModelSerializers::Model
  attributes :event,
    :sender_email,
    :user_email,
    :subject,
    :plain_text_content,
    :responsable_metier_email,
    :nom_raison_sociale,
    :previous_enrollment_id,
    :scopes
end
