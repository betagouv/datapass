class RefreshUser < ApplicationService
  def initialize(access_token)
    @access_token = access_token
  end

  def call
    response = Http.get(
      "#{ENV.fetch("OAUTH_HOST")}/oauth/userinfo",
      @access_token,
      "api auth"
    )

    User.reconcile(response.parse)
  end
end
