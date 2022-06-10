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

  attribute :data_provider

  has_many :team_members, serializer: TeamMemberWithProfileSerializer
  has_many :events, serializer: WebhookEventSerializer

  def data_provider
    object.target_api
  end
end
