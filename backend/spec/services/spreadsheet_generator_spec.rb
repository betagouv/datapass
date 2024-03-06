require "roo"
require "tempfile"

RSpec.describe SpreadsheetGenerator do
  describe "#perform" do
    let(:enrollment) { create(:enrollment, :franceconnect) }
    let(:enrollment_2) { create(:enrollment, :api_entreprise) }
    let(:enrollments) { Enrollment.where(id: [enrollment.id, enrollment_2.id]) }
    let(:file) { Tempfile.new("spreadsheet") }

    subject(:spreadsheet) do
      spreadsheet_binary_data = SpreadsheetGenerator.new(enrollments).perform
      file.binmode
      file.write(spreadsheet_binary_data)
      file.rewind
      Roo::Spreadsheet.open(file.path, extension: :xlsx)
    end

    after :each do
      file.unlink
    end

    it "generates a spreadsheet with an header row" do
      expect(spreadsheet.sheet(0).row(1)).to include("id", "target_api", "validated_at")
    end

    it "generates a spreadsheet with enrollments" do
      expect(spreadsheet.sheet(0).row(2)[0]).to eq(enrollments[0].id)
      expect(spreadsheet.sheet(0).row(3)[0]).to eq(enrollments[1].id)
    end

    it "generate a spreadsheet with 3 rows including an header and 2 enrollments" do
      expect(spreadsheet.sheet(0).last_row).to eq(3)
    end
  end
end
