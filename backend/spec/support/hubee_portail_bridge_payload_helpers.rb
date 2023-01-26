module HubeePortailBridgePayloadHelpers
  include WebMock::API

  def stub_hubee_portail_bridge_call
    stub_request(:post, "#{ENV.fetch("HUBEE_HOST")}/referential/v1/subscriptions")
      .to_return(body: "1234567890", status: 200)
  end

  # def hubee_bridge_payload
  #   {
  #     datapassId: enrollment.id,
  #     processCode: "CERTDC",
  #     subscriber: {
  #       type: "SI",
  #       companyRegister: "21920023500014",
  #       branchCode: code_commune
  #     },
  #     accessMode: nil,
  #     notificationFrequency: "unitaire",
  #     activateDateTime: nil,
  #     validateDateTime: validated_at.iso8601,
  #     rejectDateTime: nil,
  #     endDateTime: nil,
  #     updateDateTime: updated_at.iso8601,
  #     delegationActor: nil,
  #     rejectionReason: nil,
  #     status: "Inactif",
  #     email: responsable_metier["email"],
  #     localAdministrator: {
  #       email: responsable_metier["email"],
  #       firstName: responsable_metier["given_name"],
  #       lastName: responsable_metier["family_name"],
  #       function: responsable_metier["job"],
  #       phoneNumber: responsable_metier["phone_number"].delete(" ").delete(".").delete("-"),
  #       mobileNumber: nil
  #     }
  #   }
  # end
end
