RSpec.describe OpinionMailer, type: :mailer do
  describe "#create" do
    subject(:mail) { described_class.with(opinion:).create }

    let(:opinion) { create(:opinion) }

    it "renders valid mail" do
      expect(mail.to).to eq([opinion.reporter.email])
      expect(mail.subject).to include("avis")

      expect(mail.body).to include("Bonjour #{opinion.reporter.full_name}")
      expect(mail.body).to include(opinion.content)
      expect(mail.body).to include(opinion.enrollment.link)
    end
  end

  describe "#comment" do
    subject(:mail) { described_class.with(opinion_comment: opinion_comment).comment }

    let(:opinion_comment) { create(:opinion_comment) }

    it "renders valid mail" do
      expect(mail.to).to eq([opinion_comment.opinion.instructor.email])
      expect(mail.subject).to include("réponse")

      expect(mail.body).to include("Bonjour #{opinion_comment.opinion.instructor.full_name}")
      expect(mail.body).to include(opinion_comment.content)
      expect(mail.body).to include(opinion_comment.opinion.enrollment.link)
    end
  end
end
