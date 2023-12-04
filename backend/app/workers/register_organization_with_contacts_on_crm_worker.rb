class RegisterOrganizationWithContactsOnCrmWorker < ApplicationWorker
  attr_reader :enrollment

  def perform(enrollment_id)
    @enrollment = Enrollment.find_by(id: enrollment_id)

    return unless enrollment

    crm_company = find_or_create_company_on_crm

    valid_team_members.each do |team_member|
      add_contact_to_company(
        find_or_create_contact_on_crm(team_member),
        crm_company
      )
    end
  end

  private

  def create_contact_on_crm(team_member)
    crm_client.create_contact(
      email: team_member.email,
      firstname: team_member.given_name,
      lastname: team_member.family_name,
      phone: team_member.phone_number,
      type_de_contact: humanize_contact_type(team_member.type)
    )
  end

  def create_company_on_crm
    crm_client.create_company(
      siret: organization.siret,
      name: organization.insee_payload["nom_raison_sociale"],
      categorie_juridique: organization.insee_payload["categorie_juridique"],
      n_datapass: enrollment.id.to_s
    )
  end

  def find_or_create_company_on_crm
    crm_company = crm_client.find_company_by_siret(organization.siret, properties_to_include: company_properties_to_retrieve)

    if crm_company
      add_datapass_to_company(crm_company)
    end

    crm_company ||
      create_company_on_crm
  end

  def find_or_create_contact_on_crm(team_member)
    crm_contact = crm_client.find_contact_by_email(team_member.email, properties_to_include: contact_properties_to_retrieve)

    if crm_contact
      add_type_to_contact(crm_contact, team_member)
    end

    crm_contact ||
      create_contact_on_crm(team_member)
  end

  def add_contact_to_company(crm_contact, crm_company)
    crm_client.add_contact_to_company(crm_contact, crm_company)
  end

  def valid_team_members
    enrollment.team_members.where(
      type: %w[
        demandeur
        contact_metier
        responsable_technique
        responsable_traitement
        delegue_protection_donnees
      ]
    )
  end

  def add_datapass_to_company(crm_company)
    datapass_ids = crm_company.properties["n_datapass"]

    datapass_ids = if datapass_ids.present? && datapass_ids.split(";").map(&:to_i).exclude?(enrollment.id)
      datapass_ids << "; #{enrollment.id}"
    else
      enrollment.id.to_s
    end

    crm_client.update_company(
      crm_company, {
        n_datapass: datapass_ids
      }
    )
  end

  def add_type_to_contact(crm_contact, team_member)
    contact_type = crm_contact.properties["type_de_contact"]

    if contact_type.present? && !contact_type.include?(humanize_contact_type(team_member.type))
      contact_type << "; #{humanize_contact_type(team_member.type)}"
    else
      contact_type = humanize_contact_type(team_member.type)
    end

    crm_client.update_contact(
      crm_contact, {
        type_de_contact: contact_type
      }
    )
  end

  def company_properties_to_retrieve
    %w[
      n_datapass
    ]
  end

  def contact_properties_to_retrieve
    %w[
      type_de_contact
    ]
  end

  def humanize_contact_type(type)
    case type
    when "contact_metier"
      "Contact Métier"
    when "responsable_technique"
      "Contact Technique"
    when "delegue_protection_donnees"
      "Délégué à la protection des données"
    when "demandeur"
      "Demandeur"
    when "responsable_traitement"
      "Responsable de traitement"
    end
  end

  def organization
    @organization ||= Organization.find_by_mon_compte_pro_id(enrollment.organization_id)
  end

  def crm_client
    @crm_client ||= HubspotApi.new
  end
end
