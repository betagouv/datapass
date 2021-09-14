RSpec.describe "Providers config", type: :acceptance do
  let(:config_file) do
    Rails.root.join("config/data_providers.yml")
  end

  it "is a valid YAML file" do
    expect {
      YAML.load_file(config_file)
    }.not_to raise_error
  end

  it "has valid fields" do
    YAML.load_file(config_file).each do |provider, config|
      next if provider == "shared"

      %w[
        support_email
        label
        mailer
      ].each do |key|
        expect(config[key]).to be_present, "Provider '#{provider}': missing key '#{key}'"
      end

      expect(config["support_email"]).to match(URI::MailTo::EMAIL_REGEXP), "Provider '#{provider}' has an invalid 'support_email' email format"

      expect(config["mailer"].keys).to include(
        "send_application",
        "validate_application",
        "review_application",
        "refuse_application",
        "notify_application_sent",
        "create_application",
        "notify"
      )

      config["mailer"].each do |mailer_template, mailer_config|
        expect(mailer_config["subject"]).to be_present, "Provider '#{provider}': missing subject for template #{mailer_template}"
      end
    end
  end
end
