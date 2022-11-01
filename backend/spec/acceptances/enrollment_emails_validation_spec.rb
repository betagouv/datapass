RSpec.describe "Enrollments emails validation", type: :acceptance do
  let(:instructor) { create(:user) }

  describe "for each target api" do
    it "does have valid templates for review, refuse, notify and validate" do
      DataProviderConfigurations.instance.send(:config).each do |target_api, _|
        next if target_api == "shared"

        expect {
          EnrollmentEmailTemplatesRetriever.new(
            create(:enrollment, target_api: target_api),
            instructor
          ).perform
        }.not_to raise_error
      end
    end
  end
end
