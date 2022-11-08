class DataProviderConfigurationsController < ApplicationController
  before_action :authenticate_user!, except: [:index]

  # GET /data_provider_configurations
  def index
    configs = DataProviderConfigurations.instance.all
      .select { |key, c| c["configure_from_backend"].present? }

    serialized_configs = configs.transform_values do |config|
      config.slice(
        "label",
        "icon",
        "email",
        "type"
      )
    end

    render status: :ok, json: {
      configurations: serialized_configs
    }
  end

  # GET /data_provider_configurations/1
  def show
    target_api = params.fetch(:target_api, {})
    unless DataProviderConfigurations.instance.exists?(target_api)
      return render status: :not_found, json: {}
    end

    config = DataProviderConfigurations.instance.config_for(target_api)

    if config["configure_from_backend"].blank?
      render status: :not_found, json: {}
    else
      serialized_config = config.slice(
        "label",
        "icon",
        "email",
        "type",
        "cguLink",
        "donneesDescription",
        "cadreJuridiqueDescription",
        "scopes",
        "groups",
        "editeurs",
        "demarches"
      )

      render status: :ok, json: {
        configuration: serialized_config
      }
    end
  end
end