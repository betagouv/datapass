class RefreshOrganizationSireneAttributesWorker < ApplicationWorker
  sidekiq_options queue: :default

  def perform(organization_id)
    organization = Organization.find(organization_id)

    organization.update!(
      insee_payload: ApiSirene.call(organization.siret),
      last_insee_update_at: DateTime.now
    )
  rescue ActiveRecord::RecordNotFound
  end
end
