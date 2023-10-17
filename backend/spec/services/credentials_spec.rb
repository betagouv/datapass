RSpec.describe Credentials, type: :service do
  let(:instance) { described_class.instance }

  describe "#get" do
    subject { instance.get(key) }

    context "when key exists in credentials" do
      let(:key) { "hubee" }

      it { is_expected.to be_present }
    end

    context "when key does not exist in credentials" do
      let(:key) { "foo" }

      it do
        expect {
          subject
        }.to raise_error(KeyError)
      end
    end
  end
end
