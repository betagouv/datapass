RSpec.describe DataProvidersConfiguration, type: :service do
  let(:instance) { described_class.instance }

  describe "#exists?" do
    subject { instance.exists?(key) }

    context "with a valid provider" do
      context "when key is a symbol" do
        let(:key) { :franceconnect }

        it { is_expected.to be == true }
      end

      context "when key is a string" do
        let(:key) { :franceconnect }

        it { is_expected.to be == true }
      end
    end

    context "with an invalid provider" do
      let(:key) { :does_not_exist }

      it { is_expected.to be == false }
    end

    context "with shared key" do
      let(:key) { :shared }

      it { is_expected.to be == false }
    end
  end

  describe "#config_for" do
    subject { instance.config_for(key) }

    context "with a valid key" do
      let(:key) { :franceconnect }

      it "renders config" do
        is_expected.to include(
          "label"
        )
      end
    end

    context "with invalid key" do
      let(:key) { :does_not_exist }

      it "raises an error" do
        expect {
          subject
        }.to raise_error(KeyError)
      end
    end
  end
end
