RSpec.describe ApiParticulierNotifier, type: :notifier do
  include ActiveJob::TestHelper

  subject(:notify_validate_event) { described_class.new(enrollment).validate(comment: default_email_content, current_user: user) }

  let(:enrollment) { create(:enrollment, :api_particulier, user:, team_members:) }
  let(:user) { create(:user) }
  let(:team_members) do
    [
      {
        type: "responsable_technique",
        email: responsable_technique_email,
        phone_number: "0636656565"
      }
    ]
  end
  let(:default_email_content) { "Contenu de l'email de validation par défaut qui est géré client side" }

  context "when response_technique is also the user (which is the demandeur)" do
    let(:responsable_technique_email) { user.email }

    it "sends only one email to this user, the default one" do
      perform_enqueued_jobs { notify_validate_event }

      expect(ActionMailer::Base.deliveries.count).to eq(1)

      mail = ActionMailer::Base.deliveries.last

      expect(mail.to).to eq([user.email])
      expect(mail.subject).to include("validée")
      expect(mail.body).to eq(default_email_content)
    end
  end

  context "when response_technique is different from the user (which is the demandeur)" do
    let(:responsable_technique_email) { generate(:email) }

    it "sends two distinct emails, one to the user and one to the response_technique" do
      perform_enqueued_jobs { notify_validate_event }

      expect(ActionMailer::Base.deliveries.count).to eq(2)

      mails = ActionMailer::Base.deliveries.last(2)

      mail_to_demandeur = mails.find { |mail| mail.to == [user.email] }

      expect(mail_to_demandeur.subject).to include("validée")
      expect(mail_to_demandeur.body).to eq(default_email_content)

      mail_to_responsable_technique = mails.find { |mail| mail.to == [responsable_technique_email] }

      expect(mail_to_responsable_technique).to be_present
      expect(mail_to_responsable_technique.subject).to include("validée")
      expect(mail_to_responsable_technique.body).to include("responsable technique")
    end
  end
end
