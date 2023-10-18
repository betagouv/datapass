class FindOrCreateOrganizationWithMonCompteProPayload < ApplicationInteractor
  def call
    context.organization = Organization.find_or_initialize_by(siret: mon_compte_pro_organization_payload["siret"])
    context.organization.assign_attributes(
      mon_compte_pro_payload: mon_compte_pro_organization_payload,
      last_mon_compte_pro_update_at: DateTime.now
    )
    context.organization.save!
  end

  private

  def mon_compte_pro_organization_payload
    context.mon_compte_pro_organization_payload
  end
end
