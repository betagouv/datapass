# frozen_string_literal: true

RSpec.describe ExtractDraftEnrollmentsToRemind, type: :service do
  subject { described_class.new }

  context "enrollment not included in #draft_enrollments call" do
    before do
      Timecop.freeze
    end

    let!(:enrollment) { create(:enrollment, :hubee_portail, :draft, created_at: 94.days.ago, updated_at: 50.days.ago) }
    let!(:event) { create(:event, :create, enrollment: enrollment, created_at: 94.days.ago, updated_at: 94.days.ago) }
    let!(:event_1) { create(:event, :update, enrollment: enrollment, created_at: 50.days.ago, updated_at: 50.days.ago) }

    after do
      Timecop.return
    end

    it "do not renders draft enrollment beyond the 1st of november" do
      result = subject.draft_enrollments
      enrollment = result.map { |enrollment| enrollment.target_api }

      expect(enrollment).to eq([])
    end
  end

  context "enrollment created in the last 14 days" do
    before do
      Timecop.freeze
    end

    let!(:api_entreprise) { create(:enrollment, :api_entreprise, :draft, created_at: 15.days.ago, updated_at: 14.days.ago) }
    let!(:event_api_entreprise) { create(:event, :create, enrollment: api_entreprise, created_at: 15.days.ago, updated_at: 14.days.ago) }

    let!(:api_part) { create(:enrollment, :api_particulier, :draft, created_at: 5.days.ago, updated_at: 5.days.ago) }
    let!(:event_api_part) { create(:event, :create, enrollment: api_part, created_at: 5.days.ago, updated_at: 5.days.ago) }

    after do
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
      before do
        Timecop.freeze
      end

      let!(:api_entreprise) { create(:enrollment, :api_entreprise, :validated, created_at: 35.days.ago, updated_at: 30.days.ago) }
      let!(:event_api_entreprise_1) { create(:event, :create, enrollment: api_entreprise, created_at: 35.days.ago, updated_at: 35.days.ago) }
      let!(:event_api_entreprise_2) { create(:event, :update, enrollment: api_entreprise, created_at: 30.days.ago, updated_at: 30.days.ago) }
      let!(:event_api_entreprise_3) { create(:event, :validate, enrollment: api_entreprise, created_at: 30.days.ago, updated_at: 30.days.ago) }

      let!(:franceconnect) { create(:enrollment, :franceconnect, :draft, created_at: 60.days.ago, updated_at: 15.days.ago) }
      let!(:event_franceconnect) { create(:event, :create, enrollment: franceconnect, created_at: 60.days.ago, updated_at: 60.days.ago) }
      let!(:event_franceconnect_1) { create(:event, :update, enrollment: franceconnect, created_at: 30.days.ago, updated_at: 30.days.ago) }
      let!(:event_franceconnect_2) { create(:event, :reminder, enrollment: franceconnect, created_at: 15.days.ago, updated_at: 15.days.ago) }

      let!(:api_impot_particulier_fc_sandbox) { create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 16.days.ago, updated_at: 16.days.ago) }
      let!(:event_impot) { create(:event, :create, enrollment: api_impot_particulier_fc_sandbox, created_at: 16.days.ago, updated_at: 16.days.ago) }
      let!(:event_impot_1) { create(:event, :notify, enrollment: api_impot_particulier_fc_sandbox, created_at: 16.days.ago, updated_at: 16.days.ago) }
      let!(:event_impot_2) { create(:event, :update, enrollment: api_impot_particulier_fc_sandbox, created_at: 16.days.ago, updated_at: 16.days.ago) }

      after do
        Timecop.return
      end

      it "renders draft enrollments between 15 days and a month ago" do
        result = subject.draft_enrollments

        expect(result.count).to eq(2)
      end
    end

    context "checking enrollment's events" do
      before :all do
        Timecop.freeze
      end

      let!(:franceconnect) { create(:enrollment, :franceconnect, :draft, created_at: 60.days.ago, updated_at: 15.days.ago) }
      let!(:event_franceconnect) { create(:event, :create, enrollment: franceconnect, created_at: 60.days.ago, updated_at: 60.days.ago) }
      let!(:event_franceconnect_1) { create(:event, :update, enrollment: franceconnect, created_at: 30.days.ago, updated_at: 30.days.ago) }
      let!(:event_franceconnect_2) { create(:event, :reminder, enrollment: franceconnect, created_at: 15.days.ago, updated_at: 15.days.ago) }

      let!(:impot_particulier) { create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 16.days.ago, updated_at: 16.days.ago) }
      let!(:event_impot_part) { create(:event, :create, enrollment: impot_particulier, created_at: 16.days.ago, updated_at: 16.days.ago) }
      let!(:event_impot_part_1) { create(:event, :notify, enrollment: impot_particulier, created_at: 16.days.ago, updated_at: 16.days.ago) }
      let!(:event_impot_part_2) { create(:event, :update, enrollment: impot_particulier, created_at: 16.days.ago, updated_at: 16.days.ago) }

      let!(:hubee_portail) { create(:enrollment, :hubee_portail, :draft, created_at: 16.days.ago, updated_at: 15.days.ago) }
      let!(:event_hubee_portail) { create(:event, :create, enrollment: hubee_portail, created_at: 15.days.ago, updated_at: 15.days.ago) }

      after :all do
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
  end

  context "when #call checks if there is any enrollments" do
    before :all do
      Timecop.freeze
    end

    let!(:impot_particulier) { create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 16.days.ago, updated_at: 16.days.ago) }
    let!(:event_impot) { create(:event, :create, enrollment: impot_particulier, created_at: 16.days.ago, updated_at: 16.days.ago) }
    let!(:event_impot_1) { create(:event, :notify, enrollment: impot_particulier, created_at: 16.days.ago, updated_at: 16.days.ago) }
    let!(:event_impot_2) { create(:event, :update, enrollment: impot_particulier, created_at: 16.days.ago, updated_at: 16.days.ago) }

    let!(:franceconnect) { create(:enrollment, :franceconnect, :draft, created_at: 15.days.ago, updated_at: 15.days.ago) }
    let!(:event) { create(:event, name: "create", enrollment: franceconnect, created_at: 15.days.ago, updated_at: 15.days.ago) }

    after :all do
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

    it "#call : returns an array" do
      results = subject.call

      expect(results).to be_an_instance_of(Array)
      expect(results.count).to eq(2)
    end
  end
end
