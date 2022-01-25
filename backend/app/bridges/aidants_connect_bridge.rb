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

    aidants = @enrollment.team_members.filter { |tm| tm.type == "aidant" }

    aidants.each do |team_member|
      Http.post(
        "#{ENV.fetch("AIDANTS_CONNECT_HOST")}/datapass_habilitation/",
        {
          data_pass_id: @enrollment.id,
          first_name: team_member.given_name,
          last_name: team_member.family_name,
          email: team_member.email,
          profession: team_member.job
        },
        ENV.fetch("AIDANTS_CONNECT_API_KEY"),
        "Aidants Connect"
      )
    end
  end
end
