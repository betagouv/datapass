class FranceconnectNotifier < BaseNotifier
  def validate(comment:, current_user:)
    RegisterOrganizationWithContactsOnHubspotWorker.perform_async(enrollment.id)

    super
  end
end
