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
    @file_names = Dir.glob("config/data_providers/*")
    @yml_content = ""
    @file_names.each do |file_name|
      @yml_content += File.read(file_name)
    end
    @yml_content
  end
end
