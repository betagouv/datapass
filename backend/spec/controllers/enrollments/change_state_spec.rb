# frozen_string_literal: true

RSpec.describe EnrollmentsController, "#change_state", type: :controller do
  subject(:make_request) { change_state_request }

  let(:change_state_request) do
    patch :change_state, params: {
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
  let(:enrollment_status) { :draft }
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

  describe "submit event" do
    let(:event) { "submit" }

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
          context "when enrollment is in draft mode" do
            it { is_expected.to have_http_status(:ok) }
          end

          context "when enrollment is in submitted mode" do
            let(:enrollment_status) { :submitted }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is not the enrollment's creator" do
          let(:user) { create(:user) }

          context "when enrollment is in draft mode" do
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
          context "when target_api is api_particulier" do
            let(:enrollment_api_target) { :api_particulier }
            let(:enrollment_technical_team_type) { :with_technical_team }

            it { is_expected.to have_http_status(:ok) }
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

      it "tracks event as submit for this enrollment" do
        expect {
          make_request
        }.to change { enrollment.events.reload.count }.by(1)

        last_enrollment_event = enrollment.events.last

        expect(last_enrollment_event.user).to eq(user)
        expect(last_enrollment_event.name).to eq("submit")
      end

      it "sets enrollment status to submitted" do
        expect {
          make_request
        }.to change { enrollment.reload.status }.to("submitted")
      end

      describe "emails send" do
        let!(:franceconnect_subscribers) do
          create_list(:user, 2, roles: ["franceconnect:subscriber"])
        end

        let(:submit_email_sample) do
          File.open(Rails.root.join("app/views/enrollment_mailer/submit.text.erb")) { |f| f.readline }.chomp[0..30]
        end

        before do
          ActiveJob::Base.queue_adapter = :inline
        end

        after do
          ActiveJob::Base.queue_adapter = :test
        end

        it " sends first email to target api subscribers to notify a new submitted enrollment from user" do
          make_request

          enrollment_user_email = ActionMailer::Base.deliveries.first
          expect(enrollment_user_email).to be_present

          expect(enrollment_user_email.to).to eq(enrollment.subscribers.pluck(:email))
          expect(enrollment_user_email.body.encoded).to include(enrollment.demandeurs.first.email)
        end

        it "sends email to enrollment's user" do
          make_request

          enrollment_user_email = ActionMailer::Base.deliveries.last
          expect(enrollment_user_email).to be_present

          expect(enrollment_user_email.to).to eq([enrollment.demandeurs.first.email])
          expect(enrollment_user_email.body.encoded).to include(submit_email_sample)
        end
      end

      describe "email sends to instructor when enrollment is submitted" do
        include ActiveJob::TestHelper

        let!(:franceconnect_subscribers) do
          create_list(:user, 2, roles: ["franceconnect:subscriber"])
        end

        let(:event) { :submit }

        before do
          login(user)
        end

        after do
          clear_enqueued_jobs
          clear_performed_jobs
        end

        context "when enrollment is submit for the first time" do
          describe "non-regression test" do
            it "enqueues an EnrollmentMailer#notification_email_unknown_software which does not raise an error" do
              Sidekiq::Testing.inline!

              expect {
                perform_enqueued_jobs do
                  make_request
                end
              }.not_to raise_error

              Sidekiq::Testing.fake!
            end
          end

          it "sends email to target_api subscribers" do
            make_request

            enqueued_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs
            notif_new_submitted_enrollment = enqueued_jobs.find { |job| job["arguments"][1] == "new_enrollment_submission_notification_email" }

            expect(ActiveJob::Base.queue_adapter.enqueued_jobs.size).to eq 2
            expect(notif_new_submitted_enrollment).to be_truthy
          end
        end

        context "when enrollment is submit after changes_requested" do
          let(:enrollment_status) { "changes_requested" }
          let(:event) { :submit }

          it "sends email to instructors when enrollment pass from request_changes to submit" do
            make_request

            enqueued_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs
            notif_submitted_enrollment = enqueued_jobs.find { |job| job["arguments"][1] == "submission_after_changes_requested_notification_email" }

            expect(ActiveJob::Base.queue_adapter.enqueued_jobs.size).to eq 2
            expect(notif_submitted_enrollment).to be_truthy
          end
        end
      end

      describe "email sends to datapass administrator" do
        include ActiveJob::TestHelper

        let(:event) { "submit" }

        before do
          login(user)
        end

        after do
          clear_enqueued_jobs
          clear_performed_jobs
        end

        context "when target_api is api_particulier" do
          let(:enrollment_api_target) { :api_particulier }

          context "when technical_team_value has not a valid siret number" do
            let(:enrollment_technical_team_type) { :technical_team_unknown_software }

            describe "non-regression test" do
              it "enqueues an EnrollmentMailer#notification_email_unknown_software which does not raise an error" do
                Sidekiq::Testing.inline!

                expect {
                  perform_enqueued_jobs do
                    make_request
                  end
                }.not_to raise_error

                Sidekiq::Testing.fake!
              end
            end

            it "sends an email to datapass administrator" do
              make_request

              enqueued_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs
              notif_unknown_software = enqueued_jobs.find { |job| job["arguments"][1] == "notification_email_unknown_software" }

              expect(ActiveJob::Base.queue_adapter.enqueued_jobs.size).to eq 3
              expect(notif_unknown_software[:args]).to include("notification_email_unknown_software")
              expect(notif_unknown_software).to be_truthy
            end
          end

          context "when technical_team_value has a valid siret number" do
            let(:enrollment_technical_team_type) { :technical_team_software }

            it "does not sends email to datapass administrator" do
              make_request

              enqueued_jobs = ActiveJob::Base.queue_adapter.enqueued_jobs
              notif_unknown_software = enqueued_jobs.find { |job| job["arguments"][1] == "notification_email_unknown_software" }

              expect(ActiveJob::Base.queue_adapter.enqueued_jobs.size).to eq 2
              expect(notif_unknown_software).to be_falsey
            end
          end
        end
      end
    end
  end

  describe "validate event" do
    let(:event) { "validate" }
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
          context "when enrollment is in draft mode" do
            it { is_expected.to have_http_status(:forbidden) }
          end

          context "when enrollment is in submitted mode" do
            let(:enrollment_status) { :submitted }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is not the enrollment's creator" do
          let(:user) { create(:user) }

          context "when enrollment is in submitted mode" do
            let(:enrollment_status) { :submitted }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is an instructor" do
          let(:user) { create(:user, roles: ["#{user_target_api_instructor}:instructor"]) }

          context "when user is an instructor for the enrollment target api" do
            let(:user_target_api_instructor) { "franceconnect" }

            context "when enrollment is in submitted mode" do
              let(:enrollment_status) { :submitted }

              context "when comment is present" do
                it { is_expected.to have_http_status(:ok) }
              end

              context "when technical_team_type is missing" do
                let(:user_target_api_instructor) { "api_particulier" }
                let(:enrollment_api_target) { :api_particulier }
                let(:enrollment_technical_team_type) { :technical_team_missing }

                it {
                  is_expected.to have_http_status(:ok)
                }
              end

              context "when comment is missing" do
                let(:comment) { nil }

                it { is_expected.to have_http_status(:unprocessable_entity) }
              end
            end

            context "when enrollment is in draft mode" do
              let(:enrollment_status) { :draft }

              it { is_expected.to have_http_status(:forbidden) }
            end
          end

          context "when user is an instructor for another target api" do
            let(:user_target_api_instructor) { "api_entreprise" }

            context "when enrollment is in submitted mode" do
              let(:enrollment_status) { :submitted }

              it { is_expected.to have_http_status(:forbidden) }
            end
          end
        end
      end
    end

    describe "actions" do
      let(:user) { create(:user, roles: ["#{user_target_api_instructor}:instructor"]) }
      let(:enrollment_status) { :submitted }
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

      it "tracks event as validate for this enrollment" do
        expect {
          make_request
        }.to change { enrollment.events.reload.count }.by(1)

        last_enrollment_event = enrollment.events.last

        expect(last_enrollment_event.user).to eq(user)
        expect(last_enrollment_event.name).to eq("validate")
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
    let(:event) { "refuse" }
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
          context "when enrollment is in draft mode" do
            it { is_expected.to have_http_status(:forbidden) }
          end

          context "when enrollment is in sent mode" do
            let(:enrollment_status) { :submitted }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is not the enrollment's creator" do
          let(:user) { create(:user) }

          context "when enrollment is in submitted mode" do
            let(:enrollment_status) { :submitted }

            it { is_expected.to have_http_status(:forbidden) }
          end
        end

        context "when user is an instructor" do
          let(:user) { create(:user, roles: ["#{user_target_api_instructor}:instructor"]) }

          context "when user is an instructor for the enrollment target api" do
            let(:user_target_api_instructor) { "franceconnect" }

            context "when enrollment is in submitted mode" do
              let(:enrollment_status) { :submitted }

              it { is_expected.to have_http_status(:ok) }
            end

            context "when enrollment is in draft mode" do
              let(:enrollment_status) { :draft }

              it { is_expected.to have_http_status(:forbidden) }
            end
          end

          context "when user is an instructor for another target api" do
            let(:user_target_api_instructor) { "api_entreprise" }

            context "when enrollment is in submitted mode" do
              let(:enrollment_status) { :submitted }

              it { is_expected.to have_http_status(:forbidden) }
            end
          end
        end
      end
    end

    describe "actions" do
      let(:user) { create(:user, roles: ["#{user_target_api_instructor}:instructor"]) }
      let(:enrollment_status) { :submitted }
      let(:user_target_api_instructor) { "franceconnect" }

      before do
        login(user)
      end

      it "sets enrollment status to refused" do
        expect {
          make_request
        }.to change { enrollment.reload.status }.to("refused")
      end

      it "tracks event as refuse for this enrollment" do
        expect {
          make_request
        }.to change { enrollment.events.reload.count }.by(1)

        last_enrollment_event = enrollment.events.last

        expect(last_enrollment_event.user).to eq(user)
        expect(last_enrollment_event.name).to eq("refuse")
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
      let(:enrollment_status) { :changes_requested }

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

  describe "notify event with enrollment state mode" do
    let(:event) { "notify" }
    let(:comment) { "comment" }

    before do
      login(user)
    end

    context "when enrollment is in draft mode" do
      let(:enrollment_status) { :draft }

      it { is_expected.to have_http_status(:ok) }
    end

    context "when enrollment is in change_requested mode" do
      let(:enrollment_status) { :changes_requested }

      it { is_expected.to have_http_status(:ok) }
    end

    context "when enrollment is in submitted mode" do
      let(:enrollment_status) { :submitted }

      it { is_expected.to have_http_status(:ok) }
    end

    context "when enrollment is in validated mode" do
      let(:enrollment_status) { :validated }

      it { is_expected.to have_http_status(:forbidden) }
    end

    context "when enrollment is in refused mode" do
      let(:enrollment_status) { :refused }

      it { is_expected.to have_http_status(:forbidden) }
    end

    context "when enrollment is in revoked mode" do
      let(:enrollment_status) { :revoked }

      it { is_expected.to have_http_status(:forbidden) }
    end
  end

  describe "request_changes" do
    let(:event) { "request_changes" }
    let(:comment) { "comment" }

    context "with valid user and enrollment" do
      let(:user) { create(:user, roles: ["franceconnect:instructor"]) }
      let(:enrollment_status) { :submitted }

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

  describe "revoke" do
    let(:event) { "revoke" }
    let(:comment) { "comment" }

    describe "with user being an instructor" do
      context "api franceconnect" do
        let(:user) { create(:user, roles: ["franceconnect:instructor"]) }
        let(:enrollment_status) { :validated }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:ok) }
      end

      context "api_entreprise" do
        let(:enrollment_api_target) { :api_entreprise }
        let(:user) { create(:user, roles: ["api_entreprise:instructor"]) }
        let(:enrollment_status) { :validated }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:ok) }
      end

      context "api_particulier" do
        let(:enrollment_api_target) { :api_particulier }
        let(:user) { create(:user, roles: ["api_particulier:instructor"]) }
        let(:enrollment_status) { :validated }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:ok) }
      end

      context "for all other apis" do
        let(:enrollment_api_target) { :api_droits_cnam }
        let(:comment) { nil }
        let(:user) { create(:user, roles: ["api_droits_cnam:instructor"]) }
        let(:enrollment_status) { :validated }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:forbidden) }
      end
    end

    describe "with enrollment not being validated yet" do
      context "franceconnect" do
        let(:user) { create(:user, roles: ["administrator"]) }
        let(:enrollment_status) { :submitted }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:forbidden) }
      end

      context "api_entreprise" do
        let(:enrollment_api_target) { :api_entreprise }
        let(:user) { create(:user, roles: ["administrator"]) }
        let(:enrollment_status) { :submitted }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:forbidden) }
      end

      context "api_particulier" do
        let(:enrollment_api_target) { :api_particulier }
        let(:user) { create(:user, roles: ["administrator"]) }
        let(:enrollment_status) { :submitted }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:forbidden) }
      end

      context "other apis" do
        let(:enrollment_api_target) { :api_droits_cnam }
        let(:user) { create(:user, roles: ["administrator"]) }
        let(:enrollment_status) { :submitted }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:forbidden) }
      end
    end

    context "with valid user and enrollment" do
      let(:user) { create(:user, roles: ["administrator"]) }
      let(:enrollment_status) { :validated }

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

  describe "archive" do
    let(:event) { "archive" }

    describe "with user being an instructor" do
      let(:user) { create(:user, roles: ["franceconnect:instructor"]) }
      context "for a validated enrollment" do
        let(:enrollment_status) { :validated }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:ok) }
      end

      context "for a draft enrollment" do
        let(:enrollment_status) { :draft }

        before do
          login(user)
        end

        it { is_expected.to have_http_status(:ok) }
      end
    end

    context "with user not being an instructor" do
      let(:user) { create(:user, roles: ["user"]) }
      let(:enrollment_status) { :validated }

      before do
        login(user)
      end

      it { is_expected.to have_http_status(:forbidden) }
    end
  end
end
