Sentry.init do |config|
  config.dsn = ENV["SENTRY_DSN"]

  config.breadcrumbs_logger = [:active_support_logger]
  config.enabled_environments = %w[production]

  config.traces_sample_rate = 1.0
end
