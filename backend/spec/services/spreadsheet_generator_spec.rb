require "roo"
require "tempfile"

RSpec.describe SpreadsheetGenerator do
  describe "#perform" do
    let(:enrollment) { create(:enrollment, :franceconnect) }
    let(:enrollment_2) { create(:enrollment, :api_entreprise) }
    let(:enrollments) { Enrollment.where(id: [enrollment.id, enrollment_2.id]) }
    let(:file) { Tempfile.new("spreadsheet") }

    let!(:create_event) { create(:event, :create, enrollment:, created_at: 7.days.ago) }
    let!(:validated_event) { create(:event, :validate, enrollment:, created_at: 3.days.ago) }

    subject(:spreadsheet) do
      spreadsheet_binary_data = SpreadsheetGenerator.new(enrollments).perform
      file.binmode
      file.write(spreadsheet_binary_data)
      file.rewind
      Roo::Spreadsheet.open(file.path, extension: :xlsx)
    end

    before do
      Timecop.freeze
    end

    after(:each) do
      file.unlink
      Timecop.return
    end

    it "generates a spreadsheet with an header row" do
      expect(spreadsheet.sheet(0).row(1)).to include("id", "target_api")
    end

    it "generates a spreadsheet with enrollments" do
      expect(spreadsheet.sheet(0).row(2)[0]).to eq(enrollments[0].id)
      expect(spreadsheet.sheet(0).row(3)[0]).to eq(enrollments[1].id)
    end

    it "generate a spreadsheet with 3 rows including an header and 2 enrollments" do
      expect(spreadsheet.sheet(0).last_row).to eq(3)
    end

    it "uses the last validated event date as the updated_at date" do
      updated_at_index = spreadsheet.sheet(0).row(1).index("updated_at")

      expect(spreadsheet.sheet(0).row(2)[updated_at_index]).to eq(3.days.ago.to_date)
    end
  end
end
