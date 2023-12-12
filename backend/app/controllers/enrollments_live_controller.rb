class EnrollmentsLiveController < AuthenticatedUserController
  def export
    @enrollments = policy_scope(Enrollment)

    xlsx_generator = Axlsx::Package.new
    workbook = xlsx_generator.workbook
    xlsx_content(workbook)
    send_data xlsx_generator.to_stream.read, filename: "export-datapass-#{Date.today}.xlsx", type: "application/xlsx"
  end

  private

  def enrollment_attributes
    %w[id target_api created_at updated_at status organization_id siret nom_raison_sociale zip_code
      technical_team_type technical_team_value demarche intitule description type_projet
      date_mise_en_production volumetrie_approximative scopes data_recipients data_retention_period
      data_retention_comment fondement_juridique_title fondement_juridique_url demandeur_email
      team_members_json cgu_approved dpo_is_informed additional_content linked_token_manager_id
      previous_enrollment_id copied_from_enrollment_id link]
  end

  def xlsx_content(workbook)
    attributes = enrollment_attributes

    workbook.add_worksheet(name: "DataPass Habilitations") do |sheet|
      sheet.add_row attributes
      @enrollments.find_each do |e|
        sheet.add_row attributes.map { |attr| e.send(attr) }
      end
    end
  end
end
