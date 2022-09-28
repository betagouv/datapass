RSpec.describe EnrollmentEmailTemplatesRetriever, type: :service do
  describe "#perform" do
    subject { described_class.new(enrollment, instructor).perform }

    let(:instructor) { create(:user, given_name: "Marc", family_name: "Moulin") }
    let(:enrollment) { create(:enrollment, target_api: target_api) }

    context "with a target_api which has no custom templates" do
      let(:target_api) { "dinum_rockstars" }
      let(:mailer_template_payload) do
        {
          "subject" => "valid subject"
        }
      end

      before do
        allow_any_instance_of(described_class).to receive(:target_api_data).and_return(
          {
            "label" => "DINUM rockstars",
            "mailer" => {
              "refuse" => mailer_template_payload,
              "request_changes" => mailer_template_payload,
              "validate" => mailer_template_payload,
              "revoke" => mailer_template_payload
            }
          }
        )
      end

      it "renders 4 templates, one for each action" do
        expect(subject.count).to eq(4)

        expect(subject.map(&:event)).to include(
          *%w[
            refuse
            request_changes
            validate
            revoke
          ]
        )
      end

      describe "request changes default template" do
        subject do
          described_class.new(enrollment, instructor).perform.find do |template|
            template.event == "request_changes"
          end
        end

        it "has a valid sender_email, which is the target api support email" do
          expect(subject.sender_email).to eq("contact@api.gouv.fr")
        end

        it "has a valid user_email, which is the enrollment's user email" do
          expect(subject.user_email).to eq(enrollment.demandeurs.first.email)
        end

        it "has a valid subject" do
          expect(subject.subject).to eq("valid subject")
        end

        describe "plain text content" do
          let(:default_request_changes_first_line) do
            File.open(Rails.root.join("app/views/enrollment_mailer/request_changes.text.erb")) { |f| f.readline }.chomp
          end

          let(:default_request_changes_third_line) do
            IO.readlines(Rails.root.join("app/views/enrollment_mailer/request_changes.text.erb"))[2].chomp
          end

          it "includes request_changes view, without layout" do
            first_line_of_plain_text = subject.plain_text_content.split("\n")[0]
            third_line_of_plain_text = subject.plain_text_content.split("\n")[2]

            expect(first_line_of_plain_text).to eq(default_request_changes_first_line)
            expect(third_line_of_plain_text).to eq(default_request_changes_third_line)
          end

          it "includes valid url to datapass" do
            expect(subject.plain_text_content).to include("#{ENV["FRONT_HOST"]}/dinum-rockstars/#{enrollment.id}")
          end

          it "includes target api humanized name" do
            expect(subject.plain_text_content).to include("DINUM rockstars")
          end
        end
      end
    end

    context "with a target api which has custom templates" do
      let(:target_api) { "api_entreprise" }

      it "renders 5 templates, one for each action" do
        expect(subject.count).to eq(4)

        expect(subject.map(&:event)).to include(
          *%w[
            refuse
            request_changes
            validate
            revoke
          ]
        )
      end

      describe "a specific template : request changes" do
        subject do
          described_class.new(enrollment, instructor).perform.find do |template|
            template.event == "request_changes"
          end
        end

        it "includes default validate view" do
          pending "Need to find a new data provider which customize emails"

          expect(subject.plain_text_content).to include("#{instructor.given_name} pour API Entreprise")
        end
      end
    end

    context "with a target api which has custom templates" do
      let(:target_api) { "hubee_portail_dila" }

      describe "a specific template : validate" do
        subject do
          described_class.new(enrollment, instructor).perform.find do |template|
            template.event == "validate"
          end
        end

        it "includes default validate view" do
          expect(subject.plain_text_content).to include("#{enrollment.responsable_metier_email}")
        end
      end
    end
  end
end
