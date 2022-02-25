to_regexp = ->(string) {
  Regexp.new(
    "^#{Regexp.escape(string).gsub('\*', "[a-zA-Z0-9-]*")}$"
  )
}

hosts = ENV.fetch("ALLOWED_ORIGINS").split(",").map(&to_regexp)

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*hosts)

    resource "*",
      methods: %i[get post put patch delete options],
      headers: %w[Authorization DNT User-Agent X-Requested-With If-Modified-Since Cache-Control Content-Type Range],
      expose: %w[Content-Disposition],
      credentials: true,
      max_age: 1728000
  end

  allow do
    origins "*"

    resource "/api/stats/*", methods: :get, headers: :any
  end
end
