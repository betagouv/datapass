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
    @config ||= YAML.load(config_raw, aliases: true)
  end

  def config_raw
    data_providers_files.inject("") do |final_payload, file|
      final_payload << File.read(file)
    end
  end

  def data_providers_files
    Dir["#{Rails.root}/config/data_providers/*.yml"].sort
  end
end
