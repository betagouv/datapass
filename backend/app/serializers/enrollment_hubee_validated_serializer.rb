class EnrollmentHubeeValidatedSerializer < ApplicationSerializer
  attributes :id, :siret, :scopes, :status, :target_api, :updated_at

  attribute :scopes do
    object.scopes.map { |scope| [scope.to_sym, true] }.to_h
  end
end
