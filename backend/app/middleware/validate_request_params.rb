class ValidateRequestParams
  # this implementation was inspired from https://joshfrankel.me/blog/don-t-let-the-null-bytes-bite/
  INVALID_CHARACTERS = [
    "\u0000" # null bytes
  ].freeze

  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new(env)

    invalid_characters_regex = Regexp.union(INVALID_CHARACTERS)

    has_invalid_character = request.params.values.any? do |value|
      value.match?(invalid_characters_regex) if value.respond_to?(:match)
    end

    if has_invalid_character
      # Stop execution and respond with the minimal amount of information
      return [400, {}, ["Bad Request"]]
    end

    @app.call(env)
  end
end
