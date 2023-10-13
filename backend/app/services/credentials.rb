class Credentials
  include Singleton

  def self.get(key)
    instance.get(key)
  end

  def get(key)
    if Rails.env.production?
      Rails.application.credentials[subenv.to_sym].fetch(key.to_sym)
    else
      local_config.fetch(key.to_sym)
    end
  end

  private

  def subenv
    ENV.fetch("SUB_RAILS_ENV")
  end

  def local_config
    @local_config ||= YAML.load_file("#{Rails.root}/config/local.yml", aliases: true, symbolize_names: true)
  end
end
