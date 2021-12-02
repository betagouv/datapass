RSpec.describe EnrollmentsController, "#trigger", type: :controller do
  subject(:make_request) { trigger_request }

  let(:trigger_request) do
    patch :trigger, params: {
      id: enrollment.id,
      event: event,
      comment: comment
    }
  end
  let(:enrollment) do
    create(
      :enrollment,
      enrollment_status,
      enrollment_api_target,
      :complete,
      enrollment_technical_team_type,
      organization_kind: :clamart,
      user: user
    )
  end
  let(:user) { create(:user, email_verified: true, organization_kind: :clamart) }
  let(:enrollment_status) { :pending }
  let(:enrollment_api_target) { :franceconnect }
  let(:enrollment_technical_team_type) { :with_technical_team }
  let(:comment) { nil }

  describe "invalid event name" do
    let(:event) { "does_not_exist" }

    before do
      login(user)
    end

    it { is_expected.to have_http_status(:bad_request) }
  end

  describe "send_application event" do
    let(:event) { "send_application" }

    before do
      allow_any_instance_of(RefreshUser).to receive(:call).and_return(
        user
      )
    end

    describe "authorization" do
      context "without user" do
        it { is_expected.to have_http_status(:unauthorized) }
      end

      context "with user" do
        before do
          login(user)
        end

        context "when user is the enrollment's creator" do
          context "when enrollment is in pending mode" do
            it { is_expected.to have_http_status(:ok) }
          end

          context "when enrollment is in sent mode" do
            let(:enrollment_status) { :sent }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is not the enrollment's creator" do
          let(:user) { create(:user) }

          context "when enrollment is in pending mode" do
            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when technical_team_type is missing" do
          context "when target_api is franceconnect" do
            let(:enrollment_technical_team_type) { :technical_team_missing }

            it { is_expected.to have_http_status(:ok) }
          end
          context "when target_api is api_particulier" do
            let(:enrollment_api_target) { :api_particulier }
            let(:enrollment_technical_team_type) { :technical_team_missing }

            it { is_expected.to have_http_status(:unprocessable_entity) }
          end
        end
      end
    end

    describe "actions" do
      before do
        login(user)
      end

      it "refreshs user" do
        expect_any_instance_of(RefreshUser).to receive(:call)

        make_request
      end

      it "tracks event as submitted for this enrollment" do
        expect {
          make_request
        }.to change { enrollment.events.reload.count }.by(1)

        last_enrollment_event = enrollment.events.last

        expect(last_enrollment_event.user).to eq(user)
        expect(last_enrollment_event.name).to eq("submitted")
      end

      it "sets enrollment status to sent" do
        expect {
          make_request
        }.to change { enrollment.reload.status }.to("sent")
      end

      describe "emails send" do
        let!(:franceconnect_subscribers) do
          create_list(:user, 2, roles: ["franceconnect:subscriber"])
        end

        let(:send_application_email_sample) do
          File.open(Rails.root.join("app/views/enrollment_mailer/send_application.text.erb")) { |f| f.readline }.chomp[0..30]
        end

        before do
          ActiveJob::Base.queue_adapter = :inline
        end

        after do
          ActiveJob::Base.queue_adapter = :test
        end

        it "sends last email to target api subscribers to notify a new sent application from user" do
          make_request

          enrollment_user_email = ActionMailer::Base.deliveries.last
          expect(enrollment_user_email).to be_present

          expect(enrollment_user_email.to).to eq(enrollment.subscribers.pluck(:email))
          expect(enrollment_user_email.body.encoded).to include(enrollment.demandeurs.first.email)
        end

        it "sends first email to enrollment's user" do
          make_request

          enrollment_user_email = ActionMailer::Base.deliveries.first
          expect(enrollment_user_email).to be_present

          expect(enrollment_user_email.to).to eq([enrollment.demandeurs.first.email])
          expect(enrollment_user_email.body.encoded).to include(send_application_email_sample)
        end
      end
    end
  end

  describe "validate_application event" do
    let(:event) { "validate_application" }
    let(:comment) { "I like trains" }

    before do
      allow(FranceconnectBridge).to receive(:call)
    end

    describe "authorization" do
      context "without user" do
        it { is_expected.to have_http_status(:unauthorized) }
      end

      context "with user" do
        before do
          login(user)
        end

        context "when user is the enrollment's creator" do
          context "when enrollment is in pending mode" do
            it { is_expected.to have_http_status(:forbidden) }
          end

          context "when enrollment is in sent mode" do
            let(:enrollment_status) { :sent }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is not the enrollment's creator" do
          let(:user) { create(:user) }

          context "when enrollment is in sent mode" do
            let(:enrollment_status) { :sent }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is an instructor" do
          let(:user) { create(:user, roles: ["#{user_target_api_instructor}:instructor"]) }

          context "when user is an instructor for the enrollment target api" do
            let(:user_target_api_instructor) { "franceconnect" }

            context "when enrollment is in sent mode" do
              let(:enrollment_status) { :sent }

              context "when comment is present" do
                it { is_expected.to have_http_status(:ok) }
              end

              context "when technical_team_type is missing" do
                let(:user_target_api_instructor) { "api_particulier" }
                let(:enrollment_api_target) { :api_particulier }
                let(:enrollment_technical_team_type) { :technical_team_missing }

                it {
                  allow(ApiParticulierBridge).to receive(:call)
                  is_expected.to have_http_status(:ok)
                }
              end

              context "when comment is missing" do
                let(:comment) { nil }

                it { is_expected.to have_http_status(:unprocessable_entity) }
              end
            end

            context "when enrollment is in pending mode" do
              let(:enrollment_status) { :pending }

              it { is_expected.to have_http_status(:forbidden) }
            end
          end

          context "when user is an instructor for another target api" do
            let(:user_target_api_instructor) { "api_entreprise" }

            context "when enrollment is in sent mode" do
              let(:enrollment_status) { :sent }

              it { is_expected.to have_http_status(:forbidden) }
            end
          end
        end
      end
    end

    describe "actions" do
      let(:user) { create(:user, roles: ["#{user_target_api_instructor}:instructor"]) }
      let(:enrollment_status) { :sent }
      let(:user_target_api_instructor) { "franceconnect" }

      before do
        login(user)
      end

      it "sets enrollment status to validated" do
        expect {
          make_request
        }.to change { enrollment.reload.status }.to("validated")
      end

      it "calls FranceconnectBridge.call" do
        make_request

        expect(FranceconnectBridge).to have_received(:call)
      end

      it "tracks event as validated for this enrollment" do
        expect {
          make_request
        }.to change { enrollment.events.reload.count }.by(1)

        last_enrollment_event = enrollment.events.last

        expect(last_enrollment_event.user).to eq(user)
        expect(last_enrollment_event.name).to eq("validated")
      end

      describe "emails send" do
        let(:stubbed_sendinblue_post) do
          stub_request(:post, "https://api.sendinblue.com/v3/smtp/email")
        end

        before do
          stubbed_sendinblue_post

          ActiveJob::Base.queue_adapter = :inline
        end

        after do
          ActiveJob::Base.queue_adapter = :test
        end

        it "sends an email to enrollment's user" do
          make_request

          enrollment_user_email = ActionMailer::Base.deliveries.first
          expect(enrollment_user_email).to be_present

          expect(enrollment_user_email.to).to eq([enrollment.demandeurs.first.email])
        end

        it "sends emails to DPO and responsable traitement" do
          make_request

          expect(stubbed_sendinblue_post).to have_been_requested.twice
        end
      end
    end
  end

  describe "refuse_validation event" do
    let(:event) { "refuse_application" }
    let(:comment) { "comment" }

    describe "authorization" do
      context "without user" do
        it { is_expected.to have_http_status(:unauthorized) }
      end

      context "with user" do
        before do
          login(user)
        end

        context "when user is the enrollment's creator" do
          context "when enrollment is in pending mode" do
            it { is_expected.to have_http_status(:forbidden) }
          end

          context "when enrollment is in sent mode" do
            let(:enrollment_status) { :sent }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is not the enrollment's creator" do
          let(:user) { create(:user) }

          context "when enrollment is in sent mode" do
            let(:enrollment_status) { :sent }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is an instructor" do
          let(:user) { create(:user, roles: ["#{user_target_api_instructor}:instructor"]) }

          context "when user is an instructor for the enrollment target api" do
            let(:user_target_api_instructor) { "franceconnect" }

            context "when enrollment is in sent mode" do
              let(:enrollment_status) { :sent }

              it { is_expected.to have_http_status(:ok) }
            end

            context "when enrollment is in pending mode" do
              let(:enrollment_status) { :pending }

              it { is_expected.to have_http_status(:forbidden) }
            end
          end

          context "when user is an instructor for another target api" do
            let(:user_target_api_instructor) { "api_entreprise" }

            context "when enrollment is in sent mode" do
              let(:enrollment_status) { :sent }

              it { is_expected.to have_http_status(:forbidden) }
            end
          end
        end
      end
    end

    describe "actions" do
      let(:user) { create(:user, roles: ["#{user_target_api_instructor}:instructor"]) }
      let(:enrollment_status) { :sent }
      let(:user_target_api_instructor) { "franceconnect" }

      before do
        login(user)
      end

      it "sets enrollment status to refused" do
        expect {
          make_request
        }.to change { enrollment.reload.status }.to("refused")
      end

      it "tracks event as refused for this enrollment" do
        expect {
          make_request
        }.to change { enrollment.events.reload.count }.by(1)

        last_enrollment_event = enrollment.events.last

        expect(last_enrollment_event.user).to eq(user)
        expect(last_enrollment_event.name).to eq("refused")
        expect(last_enrollment_event.comment).to eq(comment)
      end

      describe "emails send" do
        before do
          ActiveJob::Base.queue_adapter = :inline
        end

        after do
          ActiveJob::Base.queue_adapter = :test
        end

        it "sends an email to enrollment's user" do
          make_request

          enrollment_user_email = ActionMailer::Base.deliveries.first
          expect(enrollment_user_email).to be_present

          expect(enrollment_user_email.to).to eq([enrollment.demandeurs.first.email])
        end
      end
    end
  end

  describe "notify" do
    let(:event) { "notify" }
    let(:comment) { "comment" }

    context "with valid user and enrollment" do
      let(:user) { create(:user, roles: ["franceconnect:instructor"]) }
      let(:enrollment_status) { :modification_pending }

      before do
        login(user)
      end

      it { is_expected.to have_http_status(:ok) }

      describe "emails send" do
        before do
          ActiveJob::Base.queue_adapter = :inline
        end

        after do
          ActiveJob::Base.queue_adapter = :test
        end

        it "sends an email to enrollment's user" do
          make_request

          enrollment_user_email = ActionMailer::Base.deliveries.first
          expect(enrollment_user_email).to be_present

          expect(enrollment_user_email.to).to eq([enrollment.demandeurs.first.email])
        end
      end
    end
  end

  describe "review_application" do
    let(:event) { "review_application" }
    let(:comment) { "comment" }

    context "with valid user and enrollment" do
      let(:user) { create(:user, roles: ["franceconnect:instructor"]) }
      let(:enrollment_status) { :sent }

      before do
        login(user)
      end

      it { is_expected.to have_http_status(:ok) }

      describe "emails send" do
        before do
          ActiveJob::Base.queue_adapter = :inline
        end

        after do
          ActiveJob::Base.queue_adapter = :test
        end

        it "sends an email to enrollment's user" do
          make_request

          enrollment_user_email = ActionMailer::Base.deliveries.first
          expect(enrollment_user_email).to be_present

          expect(enrollment_user_email.to).to eq([enrollment.demandeurs.first.email])
        end
      end
    end
  end
end
