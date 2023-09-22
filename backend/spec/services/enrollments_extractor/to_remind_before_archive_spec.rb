# frozen_string_literal: true

RSpec.describe EnrollmentsExtractor::ToRemindBeforeArchive, type: :service do
  subject { described_class.new }

  before do
    [
      Enrollment,
      Event
    ].each do |klass|
      klass.destroy_all
    end
  end

  describe "enrollments not included in #call with only changes_requested status and request_changes, update or reminder events" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2, day: 1))

      enrollment = create(:enrollment, :api_entreprise, :changes_requested, created_at: 7.months.ago, updated_at: 6.months.ago)
      create(:event, :request_changes, enrollment: enrollment, created_at: (6.months.ago + 5.days), updated_at: (6.months.ago + 5.days))
      create(:event, :update, enrollment: enrollment, created_at: 6.months.ago, updated_at: 6.months.ago)

      enrollment = create(:enrollment, :api_entreprise, :changes_requested, created_at: 2.months.ago, updated_at: 1.month.ago)
      create(:event, :request_changes, enrollment: enrollment, created_at: 1.month.ago, updated_at: 1.month.ago)
    end

    after do
      Timecop.return
    end

    it "does not renders changes_requested enrollments less than 6 months old" do
      result = subject.call
      enrollment = result.map { |enrollment| enrollment.target_api }

      expect(enrollment).to eq([])
    end
  end

  describe "enrollments included in #call with only changes_requested status and request_changes, update or reminder events" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2, day: 1))

      enrollment = create(:enrollment, :api_entreprise, :validated, created_at: (9.months.ago + 5.days), updated_at: (8.months.ago + 28.days))
      create(:event, :create, enrollment: enrollment, created_at: (9.months.ago + 5.days), updated_at: (9.months.ago + 5.days))
      create(:event, :update, enrollment: enrollment, created_at: 9.months.ago, updated_at: 9.months.ago)
      create(:event, :submit, enrollment: enrollment, created_at: 9.months.ago, updated_at: 9.months.ago)
      create(:event, :validate, enrollment: enrollment, created_at: (8.months.ago + 28.days), updated_at: (8.months.ago + 28.days))

      enrollment = create(:enrollment, :franceconnect, :changes_requested, created_at: (8.months.ago + 15.days), updated_at: 8.months.ago)
      create(:event, :create, enrollment: enrollment, created_at: (8.months.ago + 15.days), updated_at: (8.months.ago + 15.days))
      create(:event, :update, enrollment: enrollment, created_at: (8.months.ago + 5.days), updated_at: (8.month.ago + 5.days))
      create(:event, :submit, enrollment: enrollment, created_at: (8.months.ago + 5.days), updated_at: (8.month.ago + 5.days))
      create(:event, :request_changes, enrollment: enrollment, created_at: (8.months.ago + 5.days), updated_at: (8.month.ago + 5.days))
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: 8.months.ago, updated_at: 8.months.ago)

      enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :changes_requested, created_at: (6.months.ago - 25.days), updated_at: (6.months.ago - 10.days))
      create(:event, :create, enrollment: enrollment, created_at: (6.months.ago - 25.days), updated_at: (6.months.ago - 25.days))
      create(:event, :notify, enrollment: enrollment, created_at: (6.months.ago - 25.days), updated_at: (6.months.ago - 25.days))
      create(:event, :update, enrollment: enrollment, created_at: (6.months.ago - 10.days), updated_at: (6.months.ago - 10.days))
      create(:event, :submit, enrollment: enrollment, created_at: (6.months.ago - 10.days), updated_at: (6.months.ago - 10.days))
      create(:event, :request_changes, enrollment: enrollment, created_at: (6.months.ago - 10.days), updated_at: (6.months.ago - 10.days))
    end

    after do
      Timecop.return
    end

    it "it renders 2 enrollments with changes_requested status between 9 months and 6 month ago" do
      result = subject.call

      expect(result.count).to eq(2)
      expect(result[0].status && result[1].status).to eq("changes_requested")
    end
  end

  context "#filter_enrollments" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2, day: 1))

      enrollment = create(:enrollment, :franceconnect, :changes_requested, created_at: (8.months.ago - 25.days), updated_at: 8.months.ago)
      create(:event, :create, enrollment: enrollment, created_at: (8.months.ago - 25.days), updated_at: (8.months.ago - 25.days))
      create(:event, :submit, enrollment: enrollment, created_at: (8.months.ago - 25.days), updated_at: (8.months.ago - 25.days))
      create(:event, :request_changes, enrollment: enrollment, created_at: (8.months.ago - 20.days), updated_at: (8.months.ago - 20.days))
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: 8.months.ago, updated_at: 8.months.ago)

      enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :changes_requested, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :create, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :submit, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :request_changes, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :update, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)

      enrollment = create(:enrollment, :api_entreprise, :changes_requested, created_at: (6.months.ago - 25.days), updated_at: (6.months.ago - 24.days))
      create(:event, :create, enrollment: enrollment, created_at: (8.months.ago - 25.days), updated_at: (8.months.ago - 25.days))
      create(:event, :submit, enrollment: enrollment, created_at: (8.months.ago - 25.days), updated_at: (8.months.ago - 25.days))
      create(:event, :notify, enrollment: enrollment, created_at: (8.months.ago - 25.days), updated_at: (8.months.ago - 25.days))
      create(:event, :request_changes, enrollment: enrollment, created_at: (6.months.ago - 24.days), updated_at: (6.months.ago - 24.days))
    end

    after do
      Timecop.return
    end

    it "orders enrollment by id and last events created" do
      enrollments = subject.query_enrollments
      result = subject.filter_enrollments(enrollments)
      event_names = result.collect { |e| e.events.map(&:name) }
      event_ids = result.collect { |e| e.events.ids }

      expect(event_names[0].last).to eq("update")
      expect(event_ids[0].last).to eq(result[0].events.last.id)
    end

    it "renders request_changes or update as last events" do
      enrollments = subject.query_enrollments
      filtered_by_last_events = subject.map_enrollments_to_last_events(enrollments)
      result = subject.filter_events_by_extract_criteria(filtered_by_last_events)

      expect(result.count).to eq(2)
      expect(result.map { |r| r.name }.sort).to eq(["update", "request_changes"].sort)
    end
  end
end
