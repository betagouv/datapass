class WebhookEnrollmentSerializer < ActiveModel::Serializer
  attributes :id,
    :intitule,
    :description,
    :demarche,
    :status,
    :siret,
    :scopes,
    :previous_enrollment_id,
    :copied_from_enrollment_id

  has_many :team_members, serializer: TeamMemberWithProfileSerializer
  has_many :events, serializer: WebhookEventSerializer
end
