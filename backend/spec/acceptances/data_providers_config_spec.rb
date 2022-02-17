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

      if config["reply_to"]
        expect(config["reply_to"]).to match(URI::MailTo::EMAIL_REGEXP), "Provider '#{provider}' has an invalid 'reply_to' email format"
      end

      expect(config["mailer"].keys).to include(
        "submit",
        "validate",
        "request_changes",
        "refuse",
        "notify_submitted",
        "create",
        "notify"
      )

      config["mailer"].each do |mailer_template, mailer_config|
        expect(mailer_config["subject"]).to be_present, "Provider '#{provider}': missing subject for template #{mailer_template}"
      end
    end
  end
end
