module DebouncePayloadHelpers
  include WebMock::API

  def stub_debounce_is_safe_to_send_call(email)
    stub_request(
      :get,
      "#{debounce_host}/v1/"
    )
      .with(query: hash_including({"email" => email}))
      .to_return(
        status: 200,
        headers: {
          "Content-Type" => "application/json"
        },
        body: debounce_payload(email).to_json
      )
  end

  def debounce_payload(email)
    if email.end_with? "yopmail.com"
      {
        "debounce" => {
          "email" => email,
          "code" => "3",
          "role" => "false",
          "free_email" => "true",
          "result" => "Invalid",
          "reason" => "Disposable",
          "send_transactional" => "0",
          "did_you_mean" => "monemail@hotmail.com"
        },
        "success" => "1",
        "balance" => "103794"
      }
    else
      {
        "debounce" => {
          "email" => email,
          "code" => "5",
          "role" => "false",
          "free_email" => "true",
          "result" => "Safe to Send",
          "reason" => "Deliverable",
          "send_transactional" => "1",
          "did_you_mean" => ""
        },
        "success" => "1",
        "balance" => "103789"
      }
    end
  end

  private

  def debounce_host
    ENV.fetch("DEBOUNCE_HOST") { "http://localhost" }
  end
end
