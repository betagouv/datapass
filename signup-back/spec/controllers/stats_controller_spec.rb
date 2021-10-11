RSpec.describe StatsController, type: :controller do
  describe "#show" do
    subject(:show_stats) do
      get :show
    end

    let!(:some_enrollments_for_stats) do
      Timecop.freeze(Time.new(2021, Time.now.month, 30))

      enrollment = create(:enrollment, :franceconnect, :pending)
      create(:event, :created, enrollment: enrollment)

      enrollment = create(:enrollment, :franceconnect, :validated, created_at: 20.days.ago)
      create(:event, :created, enrollment: enrollment, created_at: 20.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 20.days.ago)
      create(:event, :validated, enrollment: enrollment, created_at: 17.days.ago)

      enrollment = create(:enrollment, :api_entreprise, :validated, created_at: 15.days.ago)
      create(:event, :created, enrollment: enrollment, created_at: 15.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 15.days.ago)
      create(:event, :asked_for_modification, enrollment: enrollment, created_at: 14.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 13.days.ago)
      create(:event, :validated, enrollment: enrollment, created_at: 12.days.ago)

      enrollment = create(:enrollment, :api_entreprise, :refused, created_at: 10.days.ago)
      create(:event, :created, enrollment: enrollment, created_at: 10.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 10.days.ago)
      create(:event, :asked_for_modification, enrollment: enrollment, created_at: 9.days.ago)
      create(:event, :submitted, enrollment: enrollment, created_at: 8.days.ago)
      create(:event, :refused, enrollment: enrollment, created_at: 7.days.ago)
    end

    after do
      Timecop.return
    end

    it { is_expected.to have_http_status(:ok) }

    it "renders valid payload" do
      stats_json = JSON.parse(show_stats.body)

      expect(stats_json["enrollment_count"]).to eq(4)
      expect(stats_json["validated_enrollment_count"]).to eq(2)

      expect(stats_json["average_processing_time_in_days"]).to eq("2")
      expect(stats_json["go_back_ratio"]).to eq(((2.0 / 3) * 100).ceil.to_s)

      expect(stats_json["monthly_enrollment_count"]).to eq([
        {
          "month" => "2021-#{Time.now.strftime("%m")}-01 00:00:00",
          "pending" => 1,
          "modification_pending" => 0,
          "sent" => 0,
          "validated" => 2,
          "refused" => 1,
          "total" => 4
        }
      ])

      expect(stats_json["enrollment_by_target_api"]).to contain_exactly(
        {
          "name" => "franceconnect",
          "count" => 2
        },
        {
          "name" => "api_entreprise",
          "count" => 2
        }
      )

      expect(stats_json["enrollment_by_status"]).to contain_exactly(
        {
          "name" => "refused",
          "count" => 1
        },
        {
          "name" => "pending",
          "count" => 1
        },
        {
          "name" => "validated",
          "count" => 2
        }
      )
    end
  end
end
