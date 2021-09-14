class WebhookUserWithProfileSerializer < ActiveModel::Serializer
  attributes :id, :uid, :email, :given_name, :family_name, :phone_number, :job
end
