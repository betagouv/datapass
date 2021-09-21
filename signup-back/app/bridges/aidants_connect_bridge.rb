class AidantsConnectBridge < ApplicationBridge
  def call
    Http.post(
      "#{ENV.fetch("AIDANTS_CONNECT_HOST")}/datapass_receiver/",
      {
        data_pass_id: @enrollment.id,
        organization_name: @enrollment.intitule,
        organization_siret: @enrollment.siret,
        organization_address: @enrollment.additional_content&.fetch("organization_address", ""),
        organization_postal_code: @enrollment.additional_content&.fetch("organization_postal_code", ""),
        organization_city: @enrollment.additional_content&.fetch("organization_city", ""),
        organization_type: @enrollment.type_projet
      },
      ENV.fetch("AIDANTS_CONNECT_API_KEY"),
      "Aidants Connect"
    )
  end
end
