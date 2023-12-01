class HubspotApi
  def find_company_by_siret(siret, properties_to_include: [])
    crm_api_client.companies.search_api.do_search(
      body: build_search_body("siret", siret, properties_to_include:)
    ).results.first
  end

  def create_company(properties)
    crm_api_client.companies.basic_api.create(
      body: {
        properties:
      }
    )
  end

  def update_company(company, properties)
    crm_api_client.companies.basic_api.update(
      company_id: company.id,
      body: {
        properties:
      }
    )
  end

  def find_contact_by_email(email, properties_to_include: [])
    crm_api_client.contacts.search_api.do_search(
      body: build_search_body("email", email, properties_to_include:)
    ).results.first
  end

  def create_contact(properties)
    crm_api_client.contacts.basic_api.create(
      body: {
        properties:
      }
    )
  end

  def update_contact(contact, properties)
    crm_api_client.contacts.basic_api.update(
      contact_id: contact.id,
      body: {
        properties:
      }
    )
  end

  def add_contact_to_company(contact, company)
    crm_api_client.associations.batch_api.create(
      from_object_type: "Contacts",
      to_object_type: "Companies",
      body: {
        inputs: [
          {
            from: {id: contact.id},
            to: {id: company.id},
            type: "contact_to_company"
          }
        ]
      }
    )
  end

  private

  def build_search_body(property_name, value, properties_to_include: [])
    {
      filterGroups: [
        {
          filters: [
            {
              propertyName: property_name,
              operator: "EQ",
              value:
            }
          ]
        }
      ],
      properties: properties_to_include
    }
  end

  def crm_api_client
    api_client.crm
  end

  def api_client
    @api_client ||= Hubspot::Client.new(access_token: Credentials.get(:hubspot_private_app_access_token))
  end
end
