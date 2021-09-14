RSpec.describe EnrollmentsEmailTemplatesController, type: :controller do
  describe "#index" do
    subject(:get_enrollments_email_templates) do
      get :index, params: {id: enrollment.id}
      response
    end

    let(:enrollment) { create(:enrollment, :sent, :franceconnect) }

    before do
      login(instructor)
    end

    context "with an unauthorized user" do
      let(:instructor) { create(:user, roles: ["dinum:instructor"]) }

      it { expect(get_enrollments_email_templates).to have_http_status(:forbidden) }
    end

    context "with an authorized user" do
      let(:instructor) { create(:user, roles: ["franceconnect:instructor"]) }
      let(:enrollment_email_templates) { build_list(:enrollment_email_template, 2) }

      before do
        allow_any_instance_of(EnrollmentEmailTemplatesRetriever).to receive(:perform).and_return(
          enrollment_email_templates
        )
      end

      it { expect(get_enrollments_email_templates).to have_http_status(:ok) }

      it "calls EnrollmentEmailTemplatesRetriever with valid arguments" do
        expect(EnrollmentEmailTemplatesRetriever).to receive(:new).with(
          enrollment,
          instructor
        ).and_call_original

        get_enrollments_email_templates
      end

      it "renders templates" do
        expect(JSON.parse(get_enrollments_email_templates.body)).to eq(
          {
            "email_templates" => enrollment_email_templates.map do |enrollment_email_template|
              {
                "action_name" => enrollment_email_template.action_name,
                "sender_email" => enrollment_email_template.sender_email,
                "user_email" => enrollment_email_template.user_email,
                "subject" => enrollment_email_template.subject,
                "plain_text_content" => enrollment_email_template.plain_text_content
              }
            end
          }
        )
      end
    end
  end
end
