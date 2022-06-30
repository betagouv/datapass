module Users
  class SessionsController < Devise::SessionsController
    # GET /users/auth/api_gouv/callback
    def api_gouv
      session[:id_token] = request.env["omniauth.auth"]["credentials"].id_token
      session[:access_token] = request.env["omniauth.auth"]["credentials"].token
      user = User.reconcile(request.env["omniauth.auth"]["info"].to_h)
      sign_in_and_redirect user
    end

    # GET /users/sign_out
    def destroy
      session.delete("access_token")
      # note that we do not delete the id_token here because we need it in redirection url
      sign_out_and_redirect current_user
    end

    # patch sign_out_and_redirect to enable redirection to other host
    def sign_out_and_redirect(resource_or_scope)
      scope = Devise::Mapping.find_scope!(resource_or_scope)
      redirect_path = after_sign_out_path_for(scope)
      Devise.sign_out_all_scopes ? sign_out : sign_out(scope)
      redirect_to redirect_path, allow_other_host: true
    end

    def after_sign_in_path_for(_scope)
      request.env["omniauth.origin"] || ENV["FRONT_HOST"]
    end

    def passthru
      render status: 404, json: "Not found. Authentication passthru."
    end

    def failure
      render status: 500, json: {message: "Authentication failure. #{failure_message}"}
    end

    def after_sign_out_path_for(_scope)
      "#{ENV["OAUTH_HOST"]}/oauth/logout?post_logout_redirect_uri=#{ENV["FRONT_HOST"]}&id_token_hint=#{session.delete("id_token")}"
    end

    protected

    # source https://github.com/plataformatec/devise/blob/db011c0192495c2f1ff28f1599d9de7b7ed76485/app/controllers/devise/omniauth_callbacks_controller.rb
    # We want this controller to inherit form Devise::SessionsController and Devise::OmniauthCallbacksController.
    # The solution is to inherit form the first and implement the missing method of the second.
    def failure_message
      exception = request.respond_to?(:get_header) ? request.get_header("omniauth.error") : request.env["omniauth.error"]
      error = exception.error_reason if exception.respond_to?(:error_reason)
      error ||= exception.error if exception.respond_to?(:error)
      error ||= (request.respond_to?(:get_header) ? request.get_header("omniauth.error.type") : request.env["omniauth.error.type"]).to_s
      error&.to_s&.humanize
    end

    def translation_scope
      "devise.omniauth_callbacks"
    end

    def _url_host_allowed?(url)
      ENV.fetch("ALLOWED_ORIGINS").split(",").any? do |e|
        url.match Regexp.new("^#{Regexp.escape(e).gsub('\*', "[a-zA-Z0-9-]*")}(/.*)?$")
      end
    rescue ArgumentError, URI::Error
      false
    end

    private

    # Override Devise::SessionsController to bypass respond_to_on_destroy which throw an error, undefined method respond_to,
    # when calling destroy with a sign out user (ex: when calling it 2 times in a row).
    def verify_signed_out_user
      if all_signed_out?
        redirect_to ENV["FRONT_HOST"], allow_other_host: true
      end
    end
  end
end
