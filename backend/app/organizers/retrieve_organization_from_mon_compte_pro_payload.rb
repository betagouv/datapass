class RetrieveOrganizationFromMonCompteProPayload < ApplicationOrganizer
  organize FindOrCreateOrganizationWithMonCompteProPayload,
    RefreshOrganizationSireneAttributes
end
