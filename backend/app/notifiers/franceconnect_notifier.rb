class FranceconnectNotifier < BaseNotifier
  def validate(comment:, current_user:)
    RegisterOrganizationWithContactsOnCrmWorker.perform_async(enrollment.id)

    super
  end
end
