RSpec.describe SendinblueWebhooksController, type: :controller do
  describe "#rgpd_contact_error" do
    let(:capability_url_id) { "JIRuylEfnrbXyJuqhfBWaIxaBqCp5OdPLt0OPTPtolKeFZ4ouxNAFPq6KlJ7Uj5T" }
    let(:sendinblue_api_key) { "sendinblue_api_key" }

    let(:message_id) { "202202171052.12015809049" }
    let(:message_uuid) { "013f67f3-1141-4371-b42e-1c64fed0d1c1" }

    let(:demandeur_email) { "acceuil@ville.fr" }
    let(:demandeur) { create(:user, email: demandeur_email) }
    let(:enrollment) { create(:enrollment, :franceconnect, :validated, user: demandeur) }
    let(:instructor_email) { "instructeur@administration.fr" }
    let(:instructor) { create(:user, email: instructor_email) }

    subject(:rgpd_contact_error) do
      post :rgpd_contact_error, params: {capability_url_id: capability_url_id}, body: webhook_payload(capability_url_id, message_id).to_json
      response
    end

    before do
      ENV["RGPD_CONTACT_ERROR_HOOK_ID"] = capability_url_id
      ENV["SENDINBLUE_API_KEY"] = sendinblue_api_key

      create(:event, :validate, enrollment: enrollment, user: instructor)

      stub_message_metadata_call(message_id, message_uuid)
      stub_email_content_call(message_uuid, demandeur_email, enrollment.id)
      stub_send_mail_call(demandeur_email, instructor_email, enrollment.id)
    end

    # context "using a wrong capability url format" do
    #   let(:capability_url_id) { "0123456789" }
    #
    #   it "returns an error" do
    #     subject
    #
    #     is_expected.to have_http_status(:not_found)
    #   end
    # end

    context "with a wrong properly formatted capability url" do
      let(:capability_url_id) { "0123456789012345678901234567890123456789012345678901234567890123" }
      before do
        ENV["RGPD_CONTACT_ERROR_HOOK_ID"] = "0123456789012345678901234567890123456789012345678901234567890124"
      end

      it "returns an error" do
        subject

        is_expected.to have_http_status(:unauthorized)
      end
    end

    context "with an unknown message id" do
      let(:message_id) { "unknown.id" }
      before do
        stub_request(
          :get,
          "https://api.sendinblue.com/v3/smtp/emails?messageId=%3C#{message_id}%40smtp-relay.mailin.fr%3E"
        ).to_return(
          status: 200,
          headers: {
            "Content-Type" => "application/json"
          },
          body: {}.to_json
        )
      end

      it "returns an accepted status" do
        subject

        is_expected.to have_http_status(:accepted)
      end
    end

    context "with good message id" do
      it "sends an email to " do
        expect_any_instance_of(SibApiV3Sdk::TransactionalEmailsApi).to receive(:send_transac_email)

        subject
      end
    end
  end
end
