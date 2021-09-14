RSpec.describe GetMajorityPercentileProcessingTimeInDays, type: :service do
  describe "#call" do
    let!(:some_enrollments_for_stats) do
      Timecop.freeze(Time.new(2021, Time.now.month, 30))

      enrollment = create(:enrollment, :franceconnect, :pending)
      create(:event, :created, enrollment: enrollment)

      enrollment = create(:enrollment, :franceconnect, :validated, created_at: 2.days.ago)
      create(:event, :created, enrollment: enrollment, created_at: 2.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 2.days.ago)
      create(:event, :validated, enrollment: enrollment, created_at: 0.days.ago)

      enrollment = create(:enrollment, :api_entreprise, :validated, created_at: 40.days.ago)
      create(:event, :created, enrollment: enrollment, created_at: 40.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 40.days.ago)
      create(:event, :asked_for_modification, enrollment: enrollment, created_at: 40.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 6.days.ago)
      create(:event, :validated, enrollment: enrollment, created_at: 0.days.ago)

      enrollment = create(:enrollment, :api_entreprise, :refused, created_at: 30.days.ago)
      create(:event, :created, enrollment: enrollment, created_at: 30.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 30.days.ago)
      create(:event, :asked_for_modification, enrollment: enrollment, created_at: 30.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 4.days.ago)
      create(:event, :refused, enrollment: enrollment, created_at: 0.days.ago)
    end

    after do
      Timecop.return
    end

    context "with two processed authorization request" do
      subject { described_class.new("api_entreprise").call }

      it "equals the average processing time" do
        expect(subject).to eq("6")
      end
    end

    context "with one auth req processed in less than 3 days" do
      subject { described_class.new("franceconnect").call }

      it "equals the minimum displayable processing time" do
        expect(subject).to eq("3")
      end
    end

    context "with no auth req processed" do
      subject { described_class.new("api-particulier").call }

      it "equals the default processing time" do
        expect(subject).to eq("21")
      end
    end
  end
end
