RSpec.describe "Providers config", type: :acceptance do
  it "is a valid YAML file" do
    expect {
      DataProviderConfigurations.instance.send(:config)
    }.not_to raise_error
  end

  it "has valid fields" do
    DataProviderConfigurations.instance.send(:config).each do |provider, config|
      next if provider == "00_shared"

      %w[
        label
        mailer
      ].each do |key|
        expect(config[key]).to be_present, "Provider '#{provider}': missing key '#{key}'"
      end

      if config["reply_to"]
        expect(config["reply_to"]).to match(URI::MailTo::EMAIL_REGEXP), "Provider '#{provider}' has an invalid 'reply_to' email format"
      end

      expect(config["mailer"].keys).to include(
        "submit",
        "validate",
        "request_changes",
        "refuse",
        "revoke",
        "create",
        "notify"
      )

      config["mailer"].each do |mailer_template, mailer_config|
        expect(mailer_config["subject"]).to be_present, "Provider '#{provider}': missing subject for template #{mailer_template}"
      end
    end
  end

  it "scopes affectation to groups should be a bijection" do
    DataProviderConfigurations.instance.send(:config).each do |provider, config|
      next if provider == "00_shared"

      if config["scopes"]
        scopes_defined_in_scopes = config["scopes"].map { |s| s["value"] }
        expect(scopes_defined_in_scopes.uniq!).to be_nil

        if config["groups"]
          scopes_used_in_groups = config["groups"].values.map { |g| g["scopes"] }.flatten
          expect(scopes_used_in_groups.uniq!).to be_nil
          expect(scopes_used_in_groups - scopes_defined_in_scopes).to be_empty
        end
      end
    end
  end
end
