RSpec.describe RefreshUser, type: :service do
  subject { described_class.new(access_token).call }

  let(:access_token) { "access_token" }
  let(:user) { create(:user) }
  let(:oauth_payload) do
    {
      "email" => user.email,
      "given_name" => "#{user.given_name} updated"
    }
  end

  let(:stub_oauth_call) do
    stub_request(:get, "#{ENV.fetch("OAUTH_HOST")}/oauth/userinfo").with(
      headers: {
        "Authorization" => "Bearer #{access_token}"
      }
    ).to_return(
      headers: {
        "Content-Type" => "application/json"
      },
      body: oauth_payload.to_json
    )
  end

  before do
    stub_oauth_call
  end

  it "calls Oauth host with valid attributes" do
    subject

    expect(stub_oauth_call).to have_been_requested
  end

  it "updates user's attributes" do
    expect {
      subject
    }.to change { user.reload.given_name }.to(oauth_payload["given_name"])
  end
end
