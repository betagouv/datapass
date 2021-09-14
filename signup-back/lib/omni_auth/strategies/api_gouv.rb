require "omniauth-oauth2"

module OmniAuth
  module Strategies
    class ApiGouv < OmniAuth::Strategies::OAuth2
      option :name, :api_gouv

      option :client_options, {
        site: ENV["OAUTH_HOST"],
        authorize_url: "/oauth/authorize",
        auth_scheme: :basic_auth,
        ssl: {
          verify: !ENV["BACK_HOST"].include?("development")
        }
      }
      option :scope, "openid email profile organizations"

      uid { raw_info["sub"] }

      info do
        raw_info
      end

      def callback_url
        "#{ENV["BACK_HOST"]}/users/auth/api_gouv/callback"
      end

      def authorize_params
        if request.params["prompt"] == "create_account"
          return super.merge(prompt: "create_account")
        end

        super
      end

      credentials do
        hash = {"token" => access_token.token}
        hash["refresh_token"] = access_token.refresh_token if access_token.expires? && access_token.refresh_token
        hash["expires_at"] = access_token.expires_at if access_token.expires?
        hash["expires"] = access_token.expires?

        if access_token.params
          hash.merge!(
            "id_token" => access_token.params["id_token"],
            "token_type" => access_token.params["token_type"],
            "refresh_token" => access_token.refresh_token
          )
        end

        hash
      end

      private

      def raw_info
        @raw_info ||= access_token.get("/oauth/userinfo").parsed
      end
    end
  end
end
