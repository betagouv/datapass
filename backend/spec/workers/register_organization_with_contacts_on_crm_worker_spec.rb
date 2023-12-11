RSpec.describe RegisterOrganizationWithContactsOnCrmWorker, type: :worker do
  subject { described_class.perform_async(enrollment_id) }

  let(:hubspot_api) { instance_double(HubspotApi) }
  let(:entity) { OpenStruct.new(id: 42, properties: {}) }

  context "when enrollment is not found" do
    let(:enrollment_id) { -1 }

    it "does not raises an error" do
      expect { subject }.not_to raise_error
    end
  end

  context "when enrollment is found" do
    let(:enrollment) { create(:enrollment, :api_particulier, :validated, create_organization: true) }
    let(:enrollment_id) { enrollment.id }

    before do
      allow(HubspotApi).to receive(:new).and_return(hubspot_api)

      allow(hubspot_api).to receive(:add_contact_to_company).and_return(true)

      allow(hubspot_api).to receive(:create_company).and_return(entity)
      allow(hubspot_api).to receive(:create_contact).and_return(entity)

      %i[
        update_company
        update_contact
      ].each do |method|
        allow(hubspot_api).to receive(method).and_return(true)
      end
    end

    context "when there is no company nor contact on Hubspot" do
      before do
        %i[
          find_company_by_siret
          find_contact_by_email
        ].each do |method|
          allow(hubspot_api).to receive(method).and_return(nil)
        end
      end

      it "does not raise error" do
        expect { subject }.not_to raise_error
      end
    end

    context "when there is a company and at least one contact on Hubspot" do
      before do
        %i[
          find_company_by_siret
          find_contact_by_email
        ].each do |method|
          allow(hubspot_api).to receive(method).and_return(entity)
        end
      end

      it "does not raise error" do
        expect { subject }.not_to raise_error
      end
    end
  end
end
