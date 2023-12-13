RSpec.describe SpreadsheetGenerator do
  describe '.generate' do
    let!(:enrollment) { create(:enrollment, :franceconnect) }
    let!(:foreign_enrollment) { create(:enrollment, :api_entreprise) }
    let(:enrollments) { [enrollment, foreign_enrollment] }
    let(:spreadsheet_generator) { SpreadsheetGenerator.new(enrollments) }

    context 'when enrollments present' do
      it 'generates a spreadsheet' do
        result = spreadsheet_generator.perform
        expect(result).not_to be_nil
        expect(result).to be_a(String)
      end
    end

    context 'when no enrollments present' do
      let(:enrollments) { [] }

      it 'generates an empty spreadsheet' do
        result = spreadsheet_generator.perform
        expect(result).not_to be_nil
        expect(result).to be_a(String)
      end
    end

    context 'when a spreadsheet generated' do
      it 'contains correct header row' do
        result = spreadsheet_generator.perform
        workbook = RubyXL::Parser.parse_buffer(result)
        worksheet = workbook.worksheets[0]

        attributes = %w[id target_api created_at updated_at status organization_id siret nom_raison_sociale zip_code
       technical_team_type technical_team_value demarche intitule description type_projet
       date_mise_en_production volumetrie_approximative scopes data_recipients data_retention_period
       data_retention_comment fondement_juridique_title fondement_juridique_url demandeur_email
       team_members_json cgu_approved dpo_is_informed additional_content linked_token_manager_id
       previous_enrollment_id copied_from_enrollment_id link]

        expect(worksheet[0].cells.map(&:value)).to eq(attributes)
      end
    end
  end
end
