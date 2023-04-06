# frozen_string_literal: true

RSpec.describe EnrollmentsExtractor::ToRemind, type: :service do
  subject { described_class.new }

  describe "draft enrollment not included in #call beyond a define date" do
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

    it "does not render enrollment beyond the 1st of july 2022" do
      result = subject.call

      expect(result).to eq([])
    end
  end

  describe "draft enrollment not included in #call created in the last 14 days" do
    before do
      Timecop.freeze(Time.now.change(year: 2022, month: 12))
    end

    before do
      enrollment = create(:enrollment, :api_entreprise, :draft, created_at: 14.days.ago, updated_at: 14.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 14.days.ago, updated_at: 14.days.ago)

      enrollment = create(:enrollment, :api_entreprise, :draft, created_at: 5.days.ago, updated_at: 5.days.ago)
      create(:event, :create, enrollment: enrollment, created_at: 5.days.ago, updated_at: 5.days.ago)
    end

    after do
      Timecop.return
    end

    it "does not render enrollments less than 14 day old" do
      result = subject.call

      expect(result).to eq([])
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
        enrollments = subject.query_enrollments
        result = subject.filter_enrollments(enrollments)

        expect(result.count).to eq(1)
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

      it "orders enrollment's events by id and last events created" do
        enrollments = subject.query_enrollments
        result = subject.filter_enrollments(enrollments)
        event_names = result.collect { |e| e.events.map(&:name) }
        event_ids = result.collect { |e| e.events.ids }

        expect(event_names[0].last).to eq("update")
        expect(event_ids[0].last).to eq(result[0].events.last.id)
      end

      context "#filter_events_by_extract_criteria" do
        it "renders update or created as last events" do
          enrollments = subject.query_enrollments
          filtered_by_last_events = subject.map_enrollments_to_last_events(enrollments)
          result = subject.filter_events_by_extract_criteria(filtered_by_last_events)

          expect(result.count).to eq(2)
          expect(result[0].name).to include("update")
          expect(result[1].name).to include("create")
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

    it "returns an array" do
      result = subject.call

      expect(result).to be_an_instance_of(Array)
    end

    it "retuns an array with enrollments" do
      enrollments = subject.query_enrollments
      result = subject.filter_enrollments(enrollments)

      result_ids = result.pluck(:id).flatten
      enrollments = Enrollment.find(result_ids)

      expect(result.count).to eq(2)
      expect(enrollments).to eq([Enrollment.find(result_ids[0]), Enrollment.find(result_ids[1])])
    end
  end
end
