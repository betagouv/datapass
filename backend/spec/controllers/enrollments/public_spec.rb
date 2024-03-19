RSpec.describe EnrollmentsController, "#public", type: :controller do
  subject(:public_enrollments_payload) do
    get :public, params: {
      filter: JSON.generate([{key: "target_api", value: [target_api]}])
    }.compact

    JSON.parse(response.body)
  end

  let!(:old_validated_franceconnect_enrollment) { create(:enrollment, :franceconnect, :validated, intitule: "old_franceconnect", updated_at: 1.day.ago) }
  let!(:newest_validated_franceconnect_enrollment) { create(:enrollment, :franceconnect, :validated, intitule: "newest_franceconnect", updated_at: 10.minutes.ago) }
  let!(:validated_aidants_connect_enrollment) { create(:enrollment, :aidants_connect, :validated, intitule: "aidants_connect", updated_at: 20.minutes.ago) }

  let!(:another_enrollment) { create(:enrollment, :franceconnect) }

  context "without target_api" do
    let(:target_api) { "" }

    it "renders all validated enrollments" do
      expect(public_enrollments_payload["enrollments"].count).to eq(3)
    end

    it "uses the public serializer, which does not contain sensitive information" do
      expect(public_enrollments_payload["enrollments"].first.keys).not_to include("dpo_email")
    end

    it "is ordered by last updated date desc" do
      expect(public_enrollments_payload["enrollments"].map { |public_enrollment_payload| public_enrollment_payload["intitule"] }).to contain_exactly(*%w[
        newest_franceconnect
        aidants_connect
        old_franceconnect
      ])
    end
  end

  context "with target_api" do
    let(:target_api) { "franceconnect" }

    it "renders validated enrollments on this target api" do
      expect(public_enrollments_payload["enrollments"].count).to eq(2)

      expect(public_enrollments_payload["enrollments"].map { |public_enrollment_payload| public_enrollment_payload["intitule"] }).to eq(%w[
        newest_franceconnect
        old_franceconnect
      ])
    end
  end
end
