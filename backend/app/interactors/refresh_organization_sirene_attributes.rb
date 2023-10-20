class RefreshOrganizationSireneAttributes < ApplicationInteractor
  def call
    RefreshOrganizationSireneAttributesWorker.perform_async(context.organization.id)
  end
end
