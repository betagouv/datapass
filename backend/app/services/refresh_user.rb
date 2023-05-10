class RefreshUser < ApplicationService
  def initialize(access_token)
    @access_token = access_token
  end

  def call
    response = Http.instance.get({
      url: "#{ENV.fetch("OAUTH_HOST")}/oauth/userinfo",
      api_key: @access_token,
      tag: "MonComptePro"
    })

    User.reconcile(response.parse)
  end
end
