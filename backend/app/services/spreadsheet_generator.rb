class SpreadsheetGenerator
  attr_reader :enrollments

  def initialize(enrollments)
    @enrollments = enrollments
  end

  def perform
    sheet = create_sheet

    add_headers(sheet)

    enrollments.find_each do |enrollment|
      sheet.add_row(build_row(enrollment))
    end

    render_xlsx_as_binary
  end

  private

  def generator
    @generator ||= Axlsx::Package.new
  end

  def enrollment_attributes
    %w[id target_api created_at updated_at status organization_id siret nom_raison_sociale zip_code
      technical_team_type technical_team_value demarche intitule description type_projet
      date_mise_en_production volumetrie_approximative scopes data_recipients data_retention_period
      data_retention_comment fondement_juridique_title fondement_juridique_url demandeur_email
      team_members_json cgu_approved dpo_is_informed additional_content linked_token_manager_id
      previous_enrollment_id copied_from_enrollment_id link]
  end

  def create_sheet
    workbook = generator.workbook
    workbook.add_worksheet(name: "DataPass Habilitations")
  end

  def add_headers(sheet)
    sheet.add_row(enrollment_attributes)
  end

  def build_row(enrollment)
    enrollment_attributes.map { |attr| enrollment.send(attr) }
  end

  def render_xlsx_as_binary
    generator.to_stream.read
  end
end
