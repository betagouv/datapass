class DataProviderConfigurationsController < AuthenticatedUserController
  skip_before_action :authenticate_user!, only: [:index]

  # GET /data_provider_configurations
  def index
    configs = DataProviderConfigurations.instance.all
      .select { |key, c| c["configure_from_backend"].present? }

    serialized_configs = configs.transform_values do |config|
      config.slice(
        "label",
        "icon",
        "email",
        "type",
        "url"
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
        "url",
        "cguLink",
        "donneesDescription",
        "cadreJuridiqueDescription",
        "scopesConfiguration",
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
