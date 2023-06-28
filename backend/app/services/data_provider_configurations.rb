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

  def config
    @config ||= YAML.safe_load(config_raw, aliases: true)
  end

  def config_raw
    data_providers_files.inject("") do |string, endpoint_file|
      string + File.read(endpoint_file)
    end
  end

  def data_providers_files
    Dir.glob("config/data_providers/*")
  end
end
