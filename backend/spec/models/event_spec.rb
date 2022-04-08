RSpec.describe Event, type: :model do
  it "has valid factory" do
    expect(build(:event)).to be_valid

    %i[
      create
      update
      notify
      validate
      refuse
      revoke
      request_changes
    ].each do |trait|
      expect(build(:event, trait)).to be_valid
    end
  end

  describe "comment validation" do
    subject { event }

    let(:event) { build(:event, name: name, comment: comment) }

    describe "events which require comment presence" do
      %w[
        refuse
        request_changes
        validate
        notify
        revoke
      ].each do |name|
        context "when name is '#{name}'" do
          let(:name) { name }

          context "when comment is present" do
            let(:comment) { "I like trains" }

            it { is_expected.to be_valid }
          end

          context "when comment is nil" do
            let(:comment) { nil }

            it { is_expected.not_to be_valid }
          end
        end
      end
    end

    describe "events which do not require comment presence" do
      %w[
        create
        update
        submit
      ].each do |name|
        context "when name is '#{name}'" do
          let(:name) { name }

          context "when comment is present" do
            let(:comment) { "I like trains" }

            it { is_expected.to be_valid }
          end

          context "when comment is nil" do
            let(:comment) { nil }

            it { is_expected.to be_valid }
          end
        end
      end
    end
  end
end
