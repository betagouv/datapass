RSpec.describe EnrollmentMailer, type: :mailer do
  describe "#notification_email" do
    let(:to_email) { generate(:email) }
    let(:target_api) { "franceconnect" }
    let(:enrollment) { create(:enrollment, :franceconnect, user: user) }
    let(:user) { create(:user, :with_all_infos) }

    describe "condition Event::EVENTS_WITH_COMMENT_AS_EMAIL_BODY" do
      subject(:mail) do
        described_class.with(
          to: to_email,
          target_api: target_api,
          enrollment_id: enrollment.id,
          template: template,
          message: message
        ).notification_email
      end

      let(:template) { "request_changes" }
      let(:message) { "Hello world!" }

      it "renders valid headers" do
        expect(mail.subject).to eq("Votre demande d’habilitation requiert des modifications")
        expect(mail.to).to eq([to_email])
        expect(mail.from).to eq(["contact@api.gouv.fr"])
      end

      it "renders valid body with message only" do
        expect(mail.body.encoded).to eq(message)
      end
    end

    describe "email triggered from backend" do
      subject(:mail) do
        described_class.with(
          to: to_email,
          target_api: target_api,
          enrollment_id: enrollment.id,
          template: template
        ).notification_email
      end

      let(:create_email_sample) do
        File.open(Rails.root.join("app/views/enrollment_mailer/create.text.erb")) { |f| f.readline }.chomp
      end

      describe "default template for a target API" do
        let(:target_api) { "aidants_connect" }
        let(:template) { "create" }

        it "renders default subject" do
          expect(mail.subject).to eq("Votre demande d’habilitation a été enregistrée")
        end

        it "renders default template" do
          expect(mail.body.encoded).to include(create_email_sample)
        end
      end

      describe "custom subject for a target API" do
        let(:target_api) { "api_entreprise" }
        let(:template) { "create" }

        it "renders custom subject" do
          expect(mail.subject).to eq("💾 Le brouillon de votre demande d’habilitation a bien été enregistré")
        end
      end

      describe "custom template for a target API" do
        let(:template) { "submit" }

        context "when skip layout option is true" do
          let(:target_api) { "api_entreprise" }

          it "renders custom template" do
            pending "Need to find a new data provider which customize emails"

            expect(mail.body.encoded).to include("Bonjour #{enrollment.demandeurs.first.given_name}")
          end
        end
      end
    end
  end

  describe "#notification_email_to_instructors" do
    let(:to_email) { instructor.email }
    let(:target_api) { "franceconnect" }
    let(:enrollment) { create(:enrollment, :franceconnect, user: user) }
    let(:user) { create(:user, :with_all_infos) }
    let(:instructor) { create(:user, :with_all_infos) }

    subject(:mail) do
      described_class.with(
        to: instructor.email,
        target_api: target_api,
        enrollment_id: enrollment.id,
        template: template
      ).notification_email_to_instructors
    end

    let(:template) { "notify_instructor" }

    let(:create_email_sample) do
      File.open(Rails.root.join("app/views/enrollment_mailer/admin/notify_instructor.text.erb")) { |f| f.readline }.chomp
    end

    it "renders valid headers" do
      instructor.roles = ["franceconnect:instructor"]
      instructor.save

      expect(mail.subject).to eq("Vous avez un nouveau message concernant une habilitation")
      expect(mail.to).to eq([instructor.email])
      expect(mail.from).to eq(["contact@api.gouv.fr"])
    end

    it "renders notify_instructor template" do
      expect(mail.body.encoded).to include(create_email_sample)
    end
  end
end
