RSpec.describe EnrollmentsController, "#create", type: :controller do
  subject(:create_enrollment) do
    post :create, params: {
      enrollment: enrollment_attributes
    }
  end

  let(:user) { create(:user, :with_all_infos) }

  before do
    login(user)

    stub_entreprise_data_etablissement_call("21920023500014")
  end

  context "with valid enrollment attributes" do
    let(:enrollment_attributes) do
      enrollment = build(:enrollment, user: user, target_api: "franceconnect")

      enrollment.attributes.merge(
        "team_members_attributes" => enrollment.team_members.map(&:attributes)
      )
    end

    it { is_expected.to have_http_status(:ok) }

    it "creates an enrollment associated to current user, with valid attributes" do
      expect {
        create_enrollment
      }.to change { user.enrollments.count }.by(1)

      latest_user_enrollment = user.enrollments.last

      expect(latest_user_enrollment.intitule).to eq(enrollment_attributes["intitule"])
      expect(latest_user_enrollment.target_api).to eq("franceconnect")
    end

    it "creates team members, with at least one demandeur" do
      expect {
        create_enrollment
      }.to change { TeamMember.count }.by(enrollment_attributes["team_members_attributes"].count)

      latest_team_members = TeamMember.last(enrollment_attributes["team_members_attributes"].count)

      expect(latest_team_members.find { |tm| tm.type == "demandeur" }).to be_present
    end

    it "creates an event 'create' associated to this enrollment and user" do
      expect {
        create_enrollment
      }.to change { user.events.count }.by(1)

      latest_user_event = user.events.last
      latest_user_enrollment = user.enrollments.last

      expect(latest_user_event.name).to eq("create")
      expect(latest_user_event.enrollment).to eq(latest_user_enrollment)
    end

    describe "email sent on creation success" do
      let(:create_email_sample) do
        File.open(Rails.root.join("app/views/enrollment_mailer/create.text.erb")) { |f| f.readline }.chomp
      end

      before do
        ActiveJob::Base.queue_adapter = :inline
      end

      after do
        ActiveJob::Base.queue_adapter = :test
      end

      it "calls notifier create method" do
        expect_any_instance_of(BaseNotifier).to receive(:create)

        subject
      end

      it "delivers a return receipt email to current user" do
        expect {
          create_enrollment
        }.to change(ActionMailer::Base.deliveries, :count).by(1)

        last_email = ActionMailer::Base.deliveries.last

        expect(last_email.to).to eq([user.email])
        expect(last_email.body).to include(create_email_sample)
      end
    end
  end

  context "with invalid target api" do
    let(:enrollment_attributes) { attributes_for(:enrollment, target_api: "does_not_exist") }

    it { is_expected.to have_http_status(:unprocessable_entity) }
  end
end
