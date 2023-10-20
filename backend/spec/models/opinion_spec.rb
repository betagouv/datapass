RSpec.describe Opinion, type: :model do
  it "has valid factories" do
    expect(build(:opinion)).to be_valid
  end

  it "can't have 2 open opinions for the same enrollment" do
    open_opinion = create(:opinion, open: true)

    expect(build(:opinion, enrollment: open_opinion.enrollment, open: true)).not_to be_valid
  end

  it "can have 2 closed opinions for the same enrollment" do
    open_opinion = create(:opinion, open: true)
    create(:opinion, enrollment: open_opinion.enrollment, open: false)

    expect(build(:opinion, enrollment: open_opinion.enrollment, open: false)).to be_valid
  end
end
