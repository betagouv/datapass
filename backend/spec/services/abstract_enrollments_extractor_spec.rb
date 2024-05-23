class DummyEnrollmentsExtractors < AbstractEnrollmentsExtractor
  def extract_from_date
    1.year.ago
  end

  def extract_criteria
    {
      statuses: %w[validated],
      included_event_names: %w[create],
      most_recent_event_names: %w[create]
    }
  end
end

RSpec.describe AbstractEnrollmentsExtractor, type: :service do
  describe "#call" do
    subject { DummyEnrollmentsExtractors.new.call }

    let!(:excluded_enrollment) { create(:enrollment, :api_entreprise, :validated) }
    let!(:valid_enrollment) { create(:enrollment, :franceconnect, :validated) }

    before do
      Enrollment.find_each do |enrollment|
        create(:event, enrollment: enrollment, name: "create")
      end
    end

    it "returns only valid enrollments" do
      expect(subject).to eq([valid_enrollment])
    end
  end
end
