# frozen_string_literal: true

RSpec.describe EnrollmentsExtractor::ToArchive, type: :service do
  subject { described_class.new }

  describe "enrollment not included in #call" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2, day: 1))
    end

    before do
      enrollment = create(:enrollment, :hubee_portail, :draft, created_at: 1.month.ago, updated_at: 15.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 1.month.ago, updated_at: 1.month.ago)
      create(:event, :update, enrollment: enrollment, created_at: 1.month.ago, updated_at: 1.month.ago)
      create(:event, :reminder, enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)

      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 1.month.ago, updated_at: 15.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 1.month.ago, updated_at: 1.month.ago)
      create(:event, :update, enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
      create(:event, :reminder, enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
    end

    after do
      Timecop.return
    end

    it "does not renders enrollments with reminder and update events created in the last 15 days" do
      result = subject.call

      expect(result).to eq([])
    end
  end

  describe "#filter_enrollments" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2, day: 1))

      enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :validated, created_at: 2.months.ago, updated_at: 2.months.ago)
      create(:event, :update, enrollment: enrollment, created_at: 2.months.ago, updated_at: 2.months.ago)
      create(:event, :submit, enrollment: enrollment, created_at: 2.months.ago, updated_at: 2.months.ago)

      enrollment = create(:enrollment, :aidants_connect, :changes_requested, created_at: 60.days.ago, updated_at: 25.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 40.days.ago, updated_at: 40.days.ago)
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: 25.days.ago, updated_at: 25.days.ago)

      enrollment = create(:enrollment, :api_sfip_sandbox, :changes_requested, created_at: 90.days.ago, updated_at: 20.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 40.days.ago, updated_at: 40.days.ago)
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: 20.days.ago, updated_at: 20.days.ago)

      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 1.month.ago, updated_at: 16.days.ago)
      create(:event, :reminder, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
    end

    after do
      Timecop.return
    end

    context "#map_enrollments_to_last_events" do
      it "returns 2 enrollments with 'reminder_before_archive' as last events" do
        enrollments = subject.query_enrollments
        result = subject.map_enrollments_to_last_events(enrollments)

        expect(result.count).to eq(2)
        expect(result[0].name && result[1].name).to eq("reminder_before_archive")
      end
    end

    context "#filter_enrollments" do
      it "returns an array of enrollments with change_requested status" do
        enrollments = subject.query_enrollments
        result = subject.filter_enrollments(enrollments)
        changes_requested_statuses = result.map { |enrollment| enrollment.status == "changes_requested" }

        expect(result.to_a).to be_an_instance_of(Array)
        expect(changes_requested_statuses).to be_truthy
      end

      it "returns 2 enrollments" do
        enrollments = subject.query_enrollments
        result = subject.filter_enrollments(enrollments)

        expect(result.count).to eq(2)
      end
    end
  end

  describe "when there is no enrollments to send reminder before archive email to" do
    before do
      Timecop.freeze(Time.now.change(year: 2022, month: 2))

      enrollment = create(:enrollment, :franceconnect, :changes_requested, created_at: 1.month.ago, updated_at: 16.days.ago)
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)

      enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 15.days.ago, updated_at: 15.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :notify, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :reminder, enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
    end

    after do
      Timecop.return
    end

    it "returns an empty array with no enrollment(s)" do
      result = subject.call

      expect(result).to eq([])
    end
  end

  describe "when enrollments with changes_requested status has received a previous reminder email" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 3, day: 8))
    end

    before do
      enrollment = create(:enrollment, :franceconnect, :changes_requested, created_at: Time.parse("04-01-2023"))
      create(:event, :create, enrollment: enrollment, created_at: Time.parse("04-01-2023"))
      create(:event, :reminder, enrollment: enrollment, created_at: Time.parse("24-01-2023"))
      create(:event, :update, enrollment: enrollment, created_at: Time.parse("28-02-2023"))
      create(:event, :submit, enrollment: enrollment, created_at: Time.parse("03-03-2023"))
      create(:event, :request_changes, enrollment: enrollment, created_at: Time.parse("03-03-2023"))
    end

    after do
      Timecop.return
    end

    it "returns an empty array with no enrollment(s)" do
      result = subject.call

      expect(result).to eq([])
    end
  end
end
