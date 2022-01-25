class SkipTokenVerifier
  def call(env)
  end
end

OmniAuth.config.request_validation_phase = SkipTokenVerifier.new
