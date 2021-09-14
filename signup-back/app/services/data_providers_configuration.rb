require "singleton"

class DataProvidersConfiguration
  include Singleton

  def exists?(key)
    key.to_s != "shared" &&
      config_backend.key?(key.to_s)
  end

  def config_for(key)
    if exists?(key)
      config_backend[key.to_s]
    else
      raise ::KeyError, "'#{key}' does not exist"
    end
  end

  private

  def config_backend
    @config_backend ||= YAML.load_file(config_backend_file)
  end

  def config_backend_file
    Rails.root.join("config/data_providers.yml")
  end
end
