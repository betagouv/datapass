# frozen_string_literal: true

RSpec.describe ExtractEnrollmentsToRemind, type: :service do
  subject { described_class.new }

  describe "enrollment not included in #filter_enrollments call" do
    before do
      Timecop.freeze(Time.now.change(year: 2022, month: 12, day: 1))
    end

    before do
      enrollment = create(:enrollment, :hubee_portail, :draft, created_at: 7.months.ago, updated_at: (5.months.ago - 1.days))
      create(:event, :create, enrollment: enrollment, created_at: 7.months.ago, updated_at: 7.months.ago)
      create(:event, :update, enrollment: enrollment, created_at: (5.months.ago - 1.days), updated_at: (5.months.ago - 1.days))
    end

    after do
      Timecop.return
    end

    it "do not renders draft enrollment beyond the 1st of july 2022" do
      result = subject.filter_enrollments
      enrollment = result.map { |enrollment| enrollment.target_api }

      expect(enrollment).to eq([])
    end
  end

  describe "enrollment created in the last 14 days" do
    before do
      Timecop.freeze(Time.now.change(year: 2022, month: 12))
    end

    before do
      enrollment = create(:enrollment, :api_entreprise, :draft, created_at: 15.days.ago, updated_at: 14.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 15.days.ago, updated_at: 14.days.ago)

      enrollment = create(:enrollment, :api_entreprise, :draft, created_at: 5.days.ago, updated_at: 5.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 5.days.ago, updated_at: 5.days.ago)
    end

    after do
      Timecop.return
    end

    it "should not be include include in the #draft_enrollment list" do
      result = subject.filter_enrollments
      enrollment = result.map { |enrollment| enrollment.target_api }

      expect(enrollment).to eq([])
    end
  end

  describe "#filter_enrollments" do
    context "when it includes only draft enrollments" do
      before do
        Timecop.freeze(Time.now.change(year: 2022, month: 12))
      end

      before do
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

      after do
        Timecop.return
      end
      it "renders draft enrollments between 15 days and a month ago" do
        result = subject.filter_enrollments

        expect(result.count).to eq(2)
      end
    end

    context "checking enrollment's events" do
      before do
        Timecop.freeze(Time.now.change(year: 2022, month: 12))
      end

      before do
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

      after do
        Timecop.return
      end

      it "includes draft enrollment with no notify events" do
        result = subject.filter_enrollments
        events = result.map { |enrollment| enrollment.events.map(&:name) }.flatten

        expect(events).to include("create", "update", "reminder")
        expect(events).not_to include("notify")
      end

      it "orders enrollment by id and last events created" do
        result = subject.filter_enrollments
        event_names = result.collect { |e| e.events.map(&:name) }
        event_ids = result.collect { |e| e.events.ids }

        expect(event_names[0].last).to eq("reminder")
        expect(event_ids[0].last).to eq(result[0].events.last.id)
      end

      context "#filter_enrollments" do
        it "renders update_at or created_at as last events" do
          result = subject.filter_enrollments
          events = result.map { |event| event.name }.flatten

          expect(result.count).to eq(2)
          expect(events).to include("create", "update")
        end
      end
    end
  end

  describe "when #call checks if there is any enrollments" do
    before do
      Timecop.freeze(Time.now.change(year: 2022, month: 12))
    end

    before do
      enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :notify, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)

      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 15.days.ago, updated_at: 15.days.ago)
      create(:event, name: "create", enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)
    end

    after do
      Timecop.return
    end

    it "returns an array with enrollment(s)" do
      result = subject.filter_enrollments

      expect(result.any?).to be_truthy
    end

    it "retuns an array with enrollments" do
      result = subject.filter_enrollments
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

  describe "when there is no draft enrollments to send reminder email to" do
    before do
      Timecop.freeze(Time.now.change(year: 2022, month: 12))
    end

    before do
      enrollment = create(:enrollment, :api_impot_particulier_fc_sandbox, :draft, created_at: 15.days.ago, updated_at: 15.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :notify, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :update, enrollment: enrollment, created_at: 16.days.ago, updated_at: 16.days.ago)
      create(:event, :reminder, enrollment: enrollment, created_at: 15.days.ago, updated_at: 15.days.ago)

      enrollment = create(:enrollment, :franceconnect, :draft, created_at: 14.days.ago, updated_at: 14.days.ago)
      create(:event, name: "create", enrollment: enrollment, created_at: 14.days.ago, updated_at: 14.days.ago)
    end

    after do
      Timecop.return
    end

    it "returns an empty array with no enrollment(s)" do
      result = subject.filter_enrollments

      expect(result).to eq([])
    end
  end
end
