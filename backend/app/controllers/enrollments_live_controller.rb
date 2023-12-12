class EnrollmentsLiveController < AuthenticatedUserController
  def export
    @enrollments = policy_scope(Enrollment)

    p = Axlsx::Package.new
    wb = p.workbook
    heading = wb.styles.add_style b: true, alignment: {horizontal: :left}
    row_style = wb.styles.add_style alignment: {wrap_text: true, horizontal: :left}

    attributes = %w[id target_api created_at updated_at status organization_id siret nom_raison_sociale zip_code
      technical_team_type technical_team_value demarche intitule description type_projet
      date_mise_en_production volumetrie_approximative scopes data_recipients data_retention_period
      data_retention_comment fondement_juridique_title fondement_juridique_url demandeur_email
      team_members_json cgu_approved dpo_is_informed additional_content linked_token_manager_id
      previous_enrollment_id copied_from_enrollment_id link]

    headers = attributes.map(&:upcase)

    wb.add_worksheet(name: "DataPass Habilitations") do |sheet|
      sheet.add_row headers, style: heading
      @enrollments.each do |e|
        sheet.add_row attributes.map { |attr| e.send(attr.to_sym) }, style: row_style
      end
    end
    send_data p.to_stream.read, filename: "export DataPass-#{Date.today}.xlsx", type: "application/xlsx"
  end
end
