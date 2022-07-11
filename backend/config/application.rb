# frozen_string_literal: true

require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
require "rails/test_unit/railtie"
require "./app/middleware/validate_request_params"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module DataPass
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.api_only = true
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore

    config.autoload_paths << Rails.root.join("lib")
    config.autoload_paths << Rails.root.join("db/migrate/concerns")

    config.i18n.default_locale = :fr

    config.public_file_server.enabled = false

    # Use a real queuing backend for Active Job (and separate queues per environment)
    config.active_job.queue_adapter = :sidekiq
    config.action_mailer.perform_caching = false

    # Ignore bad email addresses and do not raise email delivery errors.
    # Set this to true and configure the email server for immediate delivery to raise delivery errors.
    config.action_mailer.raise_delivery_errors = false
    config.action_mailer.default charset: "utf-8"

    config.action_mailer.perform_deliveries = true

    # remove scheme from url
    uri = URI(ENV["BACK_HOST"])
    config.action_mailer.default_url_options = {host: uri.hostname + uri.path}
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
      address: "smtp-relay.sendinblue.com",
      port: 587,
      user_name: ENV["SENDINBLUE_USERNAME"], # See: https://account.sendinblue.com/advanced/api
      password: ENV["SENDINBLUE_SMTP_KEY"], # See: https://account.sendinblue.com/advanced/api
      authentication: :plain,
      enable_starttls_auto: true
    }

    if ENV["DO_NOT_SEND_MAIL"].present?
      config.action_mailer.perform_deliveries = false
      config.action_mailer.delivery_method = :test
    end

    if ENV.fetch("ALLOWED_ORIGINS").include? "localhost"
      Rails.application.config.action_dispatch.cookies_same_site_protection = :none
    end

    config.middleware.insert_before Rack::Head, ValidateRequestParams

    config.cache_store = :redis_cache_store, {url: ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" }}
  end
end

Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8
