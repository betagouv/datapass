RSpec.describe Organization, type: :model do
  it "has valid factories" do
    expect(build(:organization)).to be_valid
  end
end
