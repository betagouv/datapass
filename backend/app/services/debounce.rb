class Debounce < ApplicationService
  def initialize(email)
    @email = email
  end

  def call
    cached_is_safe_to_send
  end

  def cached_is_safe_to_send
    Rails.cache.fetch("debounce_is_safe_to_send/#{@email}", expires_in: 7.days) do
      is_safe_to_send
    end
  end

  def is_safe_to_send
    if do_not_validate_mail?
      return true
    end

    response = Http.instance.get({
      url: "#{debounce_host}/v1/?email=#{@email}&api=#{debounce_api_key}",
      tag: "API Debounce"
    })

    send_transactional = response.parse["debounce"]["send_transactional"]

    send_transactional == "1"
  end

  private

  def do_not_validate_mail?
    ENV.fetch("DO_NOT_VALIDATE_MAIL") == "True"
  end

  def debounce_host
    ENV.fetch("DEBOUNCE_HOST") { "http://localhost" }
  end

  def debounce_api_key
    ENV.fetch("DEBOUNCE_API_KEY") { "" }
  end
end
