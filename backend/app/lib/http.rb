require "singleton"

class Http
  include Singleton

  def get(url_as_string, api_key, endpoint_label, auth_header = nil, auth_method = "Bearer")
    logger = Logger.new($stdout)
    http = HTTP.timeout(10).use(logging: {logger: logger})

    response = if auth_header.nil?
      http
        .auth("#{auth_method} #{api_key}")
        .headers(accept: "application/json")
        .get(url_as_string)
    else
      http
        .headers(auth_header => api_key)
        .headers(accept: "application/json")
        .get(url_as_string)
    end

    unless response.status.success?
      raise ApplicationController::BadGateway.new(
        endpoint_label,
        url_as_string,
        response.code,
        response.to_s
      )
    end

    response
  rescue HTTP::Error => e
    raise ApplicationController::BadGateway.new(
      endpoint_label,
      url_as_string,
      nil,
      nil
    ), e.message
  rescue OpenSSL::SSL::SSLError => e
    raise ApplicationController::BadGateway.new(
      endpoint_label,
      url_as_string,
      nil,
      nil
    ), e.message
  end

  def request(http_verb, url_as_string, body, api_key, endpoint_label, auth_header, auth_method, content_type)
    logger = Logger.new($stdout)
    http = HTTP.timeout(10).use(logging: {logger: logger})
      .headers(accept: "application/json")

    http_with_auth = if auth_header.nil?
      http.auth("#{auth_method} #{api_key}")
    else
      http.headers(auth_header => api_key)
    end

    response = if content_type == "application/x-www-form-urlencoded"
      http_with_auth
        .send(http_verb, url_as_string, form: body)
    else
      http_with_auth
        .send(http_verb, url_as_string, json: body)
    end

    unless response.status.success?
      raise ApplicationController::BadGateway.new(
        endpoint_label,
        url_as_string,
        response.code,
        response.to_s
      )
    end

    response
  rescue HTTP::Error => e
    raise ApplicationController::BadGateway.new(
      endpoint_label,
      url_as_string,
      nil,
      nil
    ), e.message
  rescue OpenSSL::SSL::SSLError => e
    raise ApplicationController::BadGateway.new(
      endpoint_label,
      url_as_string,
      nil,
      nil
    ), e.message
  end

  def post(url_as_string, body, api_key, endpoint_label, auth_header = nil, auth_method = "Bearer", content_type = "application/json")
    request(:post, url_as_string, body, api_key, endpoint_label, auth_header, auth_method, content_type)
  end

  def patch(url_as_string, body, api_key, endpoint_label, auth_header = nil, auth_method = "Bearer")
    request(:patch, url_as_string, body, api_key, endpoint_label, auth_header, auth_method, "application/json")
  end
end
