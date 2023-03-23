# frozen_string_literal: true

RSpec.describe ArchiveAfterReminderEnrollments, type: :service do
  subject { described_class.new }

  describe "enrollment not included in #preselect_enrollments_to_archive" do
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

    it "excludes enrollments with reminder and update events created in the last 15 days" do
      result = subject.enrollments_to_archive
      enrollment = result.map { |enrollment| enrollment.target_api }

      expect(enrollment).to eq([])
    end
  end

  describe "#enrollments_to_archive" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 2, day: 1))
    end

    before do
      enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :validated, created_at: 2.months.ago, updated_at: 2.months.ago)
      create(:event, :update, enrollment: enrollment, created_at: 2.months.ago, updated_at: 2.months.ago)
      create(:event, :submit, enrollment: enrollment, created_at: 2.months.ago, updated_at: 2.months.ago)

      enrollment = create(:enrollment, :api_particulier, :changes_requested, created_at: 60.days.ago, updated_at: 25.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 40.days.ago, updated_at: 40.days.ago)
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: 25.days.ago, updated_at: 25.days.ago)

      enrollment = create(:enrollment, :hubee_portail, :changes_requested, created_at: 90.days.ago, updated_at: 20.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 40.days.ago, updated_at: 40.days.ago)
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: 20.days.ago, updated_at: 20.days.ago)

      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 1.month.ago, updated_at: 16.days.ago)
      create(:event, :reminder, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
    end

    after do
      Timecop.return
    end

    context "#enrollments_to_archive" do
      it "renders an array of enrollments with change_requested status" do
        result = subject.preselect_enrollments_to_archive

        expect(result.to_a).to be_an_instance_of(Array)
        expect(result.count).to eq(2)
      end

      it "renders reminder as last events" do
        result = subject.preselect_enrollments_to_archive
        events = result.lazy.map { |enrollment| enrollment.events.last }.to_a
          .select { |event| event.name == "reminder_before_archive" }

        expect(events.count).to eq(2)
      end
    end

    context "#call" do
      it "returns api_particulier enrollment" do
        result = subject.call

        expect(result.count).to eq(2)
        expect(result.to_a).to be_an_instance_of(Array)
      end
    end
  end

  describe "when there is no enrollments to send reminder email to" do
    before do
      Timecop.freeze(Time.now.change(year: 2022, month: 2))
    end

    before do
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
      result = subject.enrollments_to_archive

      expect(result).to eq([])
    end
  end

  describe "when enrollments has received a draft reminder email" do
    before do
      Timecop.freeze(Time.now.change(year: 2023, month: 3, day: 8))
    end

    before do
      enrollment = create(:enrollment, :franceconnect, :changes_requested, created_at: Time.parse("04-01-2023"))
      create(:event, :create, enrollment: enrollment, created_at: Time.parse("04-01-2023"))
      create(:event, :reminder_before_archive, enrollment: enrollment, created_at: Time.parse("24-01-2023"))
      create(:event, :update, enrollment: enrollment, created_at: Time.parse("28-02-2023"))
      create(:event, :submit, enrollment: enrollment, created_at: Time.parse("03-03-2023"))
      create(:event, :request_changes, enrollment: enrollment, created_at: Time.parse("03-03-2023"))
    end

    after do
      Timecop.return
    end

    it "returns an empty array with no enrollment(s)" do
      result = subject.enrollments_to_archive

      expect(result).to eq([])
    end
  end
end
