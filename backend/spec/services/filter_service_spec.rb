RSpec.describe FilterService, type: :service do
  describe "#call" do
    let!(:filter_enrollments) do
      @enrollment_franceconnect = create(:enrollment, :franceconnect, :draft)
      create(:event, :create, enrollment: @enrollment_franceconnect)

      @enrollment_api_entreprise = create(:enrollment, :api_entreprise, :draft)
      create(:event, :create, enrollment: @enrollment_api_entreprise)
    end

    context "with a filter set on target_api" do
      subject { described_class.new({filter: JSON.generate([{"target_api" => ["franceconnect"]}])}).call(Enrollment.all) }

      it "returns only the one with the correct target_api" do
        expect(subject.count).to eq(1)

        expect(subject.map { |subject| subject["target_api"] }).to eq([
          @enrollment_franceconnect.target_api
        ])
      end
    end
  end
end
