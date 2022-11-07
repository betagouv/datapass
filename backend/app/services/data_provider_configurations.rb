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
    @config ||= YAML.load_file(config_file)
  end

  def config_file
    Rails.root.join("config/data_providers.yml")
  end
end
