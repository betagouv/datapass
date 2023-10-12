class WebhookUserWithProfileSerializer < ApplicationSerializer
  attributes :id, :uid, :email, :given_name, :family_name, :phone_number, :job
end
