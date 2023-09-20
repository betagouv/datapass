require "singleton"

class DataProviderConfigurations
  include Singleton

  def exists?(key)
    key.to_s != "shared" &&
      config.key?(key.to_s)
  end

  def all
    config
  end

  def config_for(key)
    if exists?(key)
      config[key.to_s]
    else
      raise ::KeyError, "'#{key}' does not exist"
    end
  end

  private

  def config
    @config ||= Rails.application.config_for("data_providers").to_h.deep_stringify_keys
  end
end
