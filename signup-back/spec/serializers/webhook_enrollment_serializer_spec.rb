RSpec.describe WebhookEnrollmentSerializer, type: :serializer do
  subject(:payload) { described_class.new(enrollment).serializable_hash }

  let(:enrollment) { create(:enrollment, :api_entreprise, :complete) }

  let!(:created_event) { create(:event, :created, enrollment: enrollment, created_at: 3.hours.ago) }
  let!(:refused_event) { create(:event, :refused, enrollment: enrollment, created_at: 2.hours.ago) }
  let!(:validated_event) { create(:event, :validated, enrollment: enrollment, created_at: 1.hours.ago) }

  before do
    enrollment.demandeurs.first.user.update!(
      uid: rand(9001).to_s
    )
    enrollment.reload
  end

  it "renders valid data" do
    expect(payload).to have_key(:id)
    expect(payload).to have_key(:demarche)

    expect(payload).to have_key(:team_members)

    %w[
      demandeur
      delegue_protection_donnees
      responsable_traitement
      contact_metier
      responsable_technique
    ].each do |user_kind|
      team_member_payload = payload[:team_members].find do |team_member_payload|
        team_member_payload[:type] == user_kind
      end
      expect(team_member_payload).to be_present, "team_members->#{user_kind} is missing"

      expect(team_member_payload).to have_key(:id)
      expect(team_member_payload).to have_key(:uid)
      expect(team_member_payload).to have_key(:email)

      if user_kind == "demandeur"
        expect(team_member_payload[:uid]).to be_present
      end
    end

    expect(payload).to have_key(:events)

    expect(payload[:events][0]).to be_present
    expect(payload[:events][0]).not_to have_key(:diff)
    expect(payload[:events][0][:name]).to eq("created")

    expect(payload[:events][0][:user]).to have_key(:email)
    expect(payload[:events][0][:user]).to have_key(:family_name)

    expect(payload[:events][-1][:name]).to eq("validated")
  end
end
