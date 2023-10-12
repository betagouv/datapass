class TeamMemberWithProfileSerializer < ApplicationSerializer
  attributes :id, :type, :email, :given_name, :family_name, :phone_number, :job

  attribute :uid do
    if object.user.present?
      object.user.uid
    end
  end
end
