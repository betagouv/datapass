RSpec.describe FilterService, type: :service do
  describe "#call" do
    let!(:filter_enrollments) do
      @enrollment_franceconnect = create(:enrollment, :franceconnect, :draft)
      create(:event, :create, enrollment: @enrollment_franceconnect)

      @enrollment_aidants_connect = create(:enrollment, :aidants_connect, :draft)
      create(:event, :create, enrollment: @enrollment_aidants_connect)
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

    context "when global_search is used" do
      before do
        @enrollment_franceconnect2 = create(:enrollment, :franceconnect, :draft)
        create(:event, :create, enrollment: @enrollment_franceconnect2)
      end

      let(:filters) { [{"key" => "global_search", "value" => "rancecon"}].to_json }
      let(:params) { {filter: filters} }
      let(:enrollments) { Enrollment.all }

      subject { FilterService.call(params, enrollments) }

      it "returns items matching the global search" do
        expect(subject.map(&:id)).to match_array([@enrollment_franceconnect["id"], @enrollment_franceconnect2["id"]])
      end

      context "when value is an exact enrollment id" do
        let(:filters) { [{"key" => "global_search", "value" => @enrollment_franceconnect.id.to_s}].to_json }

        it "returns only this item" do
          expect(subject.map(&:id)).to eq([@enrollment_franceconnect["id"]])
        end
      end
    end

    context "when global_search is used with fuzzy matching" do
      let(:filters) { [{"key" => "global_search", "value" => "commune d clamart"}].to_json }
      let(:params) { {filter: filters} }
      let(:enrollments) { Enrollment.all }

      subject { FilterService.call(params, enrollments) }

      it "returns items even when the search term is not exact" do
        expect(subject.map(&:id)).to match_array([@enrollment_franceconnect.id, @enrollment_aidants_connect.id])
      end
    end

    context "when the global_search term has too many typos" do
      let(:filters) { [{"key" => "global_search", "value" => "commune d calmart"}].to_json }
      let(:params) { {filter: filters} }
      let(:enrollments) { Enrollment.all }

      subject { FilterService.call(params, enrollments) }

      it { is_expected.to be_empty }
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
