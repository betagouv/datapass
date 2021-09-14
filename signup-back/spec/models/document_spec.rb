RSpec.describe Document, type: :model do
  it "has valid factories" do
    expect(build(:document)).to be_valid
  end

  describe "attachment validation" do
    subject { build(:document, file_extension: file_extension) }
    context "with a pdf" do
      let(:file_extension) { "pdf" }

      it { is_expected.to be_valid }
    end

    context "with a png" do
      let(:file_extension) { "png" }

      it { is_expected.not_to be_valid }
    end
  end
end
