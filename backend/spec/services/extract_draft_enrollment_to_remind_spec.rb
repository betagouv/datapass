# frozen_string_literal: true

require "rails_helper"

RSpec.describe ExtractDraftEnrollmentsToRemind, type: :worker do
  subject { described_class.new }

  context "enrollment not included in #draft_enrollments call" do
    before :each do
      Timecop.freeze

      enrollment = create(:enrollment, :hubee_portail, :draft, created_at: 94.days.ago, updated_at: 50.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 94.days.ago, updated_at: 94.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 50.days.ago, updated_at: 50.days.ago)
    end

    after :each do
      Timecop.return
    end

    it "do not renders draft enrollment beyond the 1st of november" do
      result = subject.draft_enrollments
      enrollment = result.map { |enrollment| enrollment.target_api }

      expect(enrollment).to eq([])
    end
  end

  context "enrollment created in the last 14 days" do
    before :each do
      Timecop.freeze

      enrollment = create(:enrollment, :api_entreprise, :draft, created_at: 5.days.ago, updated_at: 5.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 5.days.ago, updated_at: 5.days.ago)
    end

    after :each do
      Timecop.return
    end

    it "should not be include include in the #draft_enrollment list" do
      result = subject.draft_enrollments
      enrollment = result.map { |enrollment| enrollment.target_api }

      expect(enrollment).to eq([])
    end
  end

  context "#draft_enrollments" do
    context "when it includes only draft enrollments" do
      before :each do
        Timecop.freeze

        enrollment = create(:enrollment, :api_entreprise, :validated, created_at: 35.days.ago, updated_at: 30.days.ago)
        create(:event, :create, enrollment: enrollment, created_at: 35.days.ago, updated_at: 35.days.ago)
        create(:event, :update, enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)
        create(:event, :validate, enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)

        enrollment = create(:enrollment, :franceconnect, :draft, created_at: 60.days.ago, updated_at: 15.days.ago)
        create(:event, :create, enrollment: enrollment, created_at: 60.days.ago, updated_at: 60.days.ago)
        create(:event, :update, enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)
        create(:event, :reminder, enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)

        enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 16.days.ago, updated_at: 16.days.ago)
        create(:event, :create, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
        create(:event, :notify, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
        create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      end

      after :each do
        Timecop.return
      end

      it "renders draft enrollments between 15 days and a month ago" do
        result = subject.draft_enrollments

        expect(result.count).to eq(2)
      end
    end
  end

  context "checking enrollment's events" do
    before :each do
      Timecop.freeze

      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 60.days.ago, updated_at: 15.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 60.days.ago, updated_at: 60.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 30.days.ago, updated_at: 30.days.ago)
      create(:event, :reminder, enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)

      enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :notify, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)

      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 15.days.ago, updated_at: 15.days.ago)
      create(:event, name: "create", enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
    end

    after :each do
      Timecop.return
    end

    it "includes draft enrollment with no notify events" do
      result = subject.draft_enrollments
      events = result.map { |enrollment| enrollment.events.map(&:name) }.flatten

      expect(events).to include("create", "update", "reminder")
      expect(events).not_to include("notify")
    end

    it "orders enrollment by id and last events created" do
      result = subject.draft_enrollments
      event_names = result.collect { |e| e.events.map(&:name) }
      event_ids = result.collect { |e| e.events.ids }

      expect(event_names[0].last).to eq("reminder")
      expect(event_ids[0].last).to eq(result[0].events.last.id)
    end

    context "#last_update_or_create_events_for_draft_enrollments" do
      it "renders update_at or created_at as last events" do
        result = subject.last_update_or_create_events_for_draft_enrollments
        events = result.map { |event| event.name }.flatten

        expect(result.count).to eq(2)
        expect(events).to include("create", "update")
      end
    end
  end

  context "when #call checks if there is any enrollments" do
    before :each do
      Timecop.freeze

      enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :notify, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)

      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 15.days.ago, updated_at: 15.days.ago)
      create(:event, name: "create", enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
    end

    after :each do
      Timecop.return
    end

    it "returns an array with enrollment(s)" do
      result = subject.last_update_or_create_events_for_draft_enrollments

      expect(result.any?).to be_truthy
    end

    it "retuns an array with enrollments" do
      result = subject.last_update_or_create_events_for_draft_enrollments
      result_ids = result.pluck(:enrollment_id).flatten

      expect(result_ids.count).to eq(2)

      enrollments = Enrollment.find(result_ids)
      expect(enrollments).to eq([Enrollment.find(result_ids[0]), Enrollment.find(result_ids[1])])
    end
  end
end
