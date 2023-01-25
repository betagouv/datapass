RSpec.describe FilterService, type: :service do
  describe "#call" do
    let!(:filter_enrollments) do
      @enrollment_franceconnect = create(:enrollment, :franceconnect, :draft)
      create(:event, :create, enrollment: @enrollment_franceconnect)

      @enrollment_api_entreprise = create(:enrollment, :api_entreprise, :draft)
      create(:event, :create, enrollment: @enrollment_api_entreprise)
    end

    context "with a filter set on target_api" do
      subject { described_class.call({filter: JSON.generate([{key: "target_api", value: ["franceconnect"]}])}, Enrollment.all) }

      it "returns only the one with the correct target_api" do
        expect(subject.count).to eq(1)

        expect(subject.map { |subject| subject["target_api"] }).to eq([
          @enrollment_franceconnect.target_api
        ])
      end
    end
  end

  describe "#sanitize_value" do
    subject { described_class.new({}, []).sanitize_value(value) }
    context "with a value string containing extra characters" do
      let(:value) { "têam_mémbers" }
      it { is_expected.to be == "team_members" }
    end
  end

  describe "#is_valid_key" do
    subject { described_class.new({}, []).is_valid_key(key, "enrollments") }
    context "with a non-valid key string" do
      let(:key) { "cgu_approved" }
      it { is_expected.to be false }
    end

    context "with a valid key string" do
      let(:key) { "siret" }
      it { is_expected.to be true }
    end
  end

  describe "#is_fuzzy" do
    subject { described_class.new({}, []).is_fuzzy(key, "enrollments") }
    context "with a non-fuzzy-allowed key string" do
      let(:key) { "status" }
      it { is_expected.to be false }
    end

    context "with a fuzzy-allowed key string" do
      let(:key) { "nom_raison_sociale" }
      it { is_expected.to be true }
    end
  end

  describe "#sanitize_key" do
    subject { described_class.new({}, []).sanitize_key(key, "enrollments") }
    context "with a key that is not team_members" do
      let(:key) { "siret" }
      it { is_expected.to be == "\"enrollments\".\"siret\"" }
    end

    context "with the team_members key" do
      let(:key) { "team_members.email" }
      it { is_expected.to be == "\"team_members\".\"email\"" }
    end
  end
end
