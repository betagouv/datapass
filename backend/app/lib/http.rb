require "singleton"
require "securerandom"

# We want to track every HTTP call made by DataPass to help debugging api call with our partners.
# We want homogeneous API to catch HTTP errors
# We had a global Time Out for each API call

class Http
  include Singleton

  def request(http_verb, options = {})
    url = options.fetch(:url)
    default_auth_header = "Authorization"
    auth_header = options.fetch(:auth_header, default_auth_header)
    auth_method = if auth_header == default_auth_header
      options.fetch(:use_basic_auth_method, false) ? "Basic " : "Bearer "
    else
      ""
    end
    use_form_content_type = options.fetch(:use_form_content_type, false)
    api_key = options.fetch(:api_key, "") || ""
    use_correlation_id = options.fetch(:use_correlation_id, false)
    body = options.fetch(:body, {})
    tag = options.fetch(:tag)
    timeout = options.fetch(:timeout, 30)

    http = HTTP.timeout(timeout).use(logging: {logger: Rails.logger})
      .headers(accept: "application/json")

    http_with_auth = api_key.empty? ?
      http : http.headers(auth_header => "#{auth_method}#{api_key}")

    http_with_correlation_id = use_correlation_id ? http_with_auth.headers("X-Correlation-ID" => SecureRandom.hex) : http_with_auth

    response = if body.empty?
      http_with_correlation_id
        .send(http_verb, url)
    elsif use_form_content_type
      http_with_correlation_id
        .send(http_verb, url, form: body)
    else
      http_with_correlation_id
        .send(http_verb, url, json: body)
    end

    unless response.status.success?
      raise ApplicationController::BadGateway.new(
        tag,
        url,
        response.code,
        response.to_s
      )
    end

    response
  rescue HTTP::Error => e
    raise ApplicationController::BadGateway.new(
      tag,
      url,
      nil,
      nil
    ), e.message
  rescue OpenSSL::SSL::SSLError => e
    raise ApplicationController::BadGateway.new(
      tag,
      url,
      nil,
      nil
    ), e.message
  end

  def get(options)
    request(:get, options)
  end

  def post(options)
    request(:post, options)
  end

  def patch(options)
    request(:patch, options)
  end
end
