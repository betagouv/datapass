module Http
  def self.get(url_as_string, api_key, endpoint_label, auth_header = nil, auth_method = "Bearer")
    http = Rails.application.config.logger ? HTTP.use(logging: {logger: Rails.application.config.logger}) : HTTP

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

  def self.request(http_verb, url_as_string, body, api_key, endpoint_label, auth_header, auth_method)
    http = Rails.application.config.logger ? HTTP.use(logging: {logger: Rails.application.config.logger}) : HTTP

    response = if auth_header.nil?
      http
        .auth("#{auth_method} #{api_key}")
        .headers(accept: "application/json")
        .send(http_verb, url_as_string, json: body)
    else
      http
        .headers(auth_header => api_key)
        .headers(accept: "application/json")
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

  def self.post(url_as_string, body, api_key, endpoint_label, auth_header = nil, auth_method = "Bearer")
    request(:post, url_as_string, body, api_key, endpoint_label, auth_header, auth_method)
  end

  def self.patch(url_as_string, body, api_key, endpoint_label, auth_header = nil, auth_method = "Bearer")
    request(:patch, url_as_string, body, api_key, endpoint_label, auth_header, auth_method)
  end
end
