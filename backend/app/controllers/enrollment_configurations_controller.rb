class EnrollmentConfigurationsController < ApplicationController
  before_action :authenticate_user!

  # GET /pass-configuration/1
  def show
    target_api = params.fetch(:target_api, {})
    unless DataProvidersConfiguration.instance.exists?(target_api)
      return render status: :not_found, json: {}
    end

    if config_frontend[target_api].nil?
      render status: :not_found, json: {}
    else
      render status: :ok, json: {
        configuration: config_frontend[target_api]
      }
    end
  end

  private

  def config_frontend
    @config_frontend ||= JSON.parse(File.read(config_frontend_path))
  end

  def config_frontend_path
    Rails.root.join("./public/data_providers_configurations.json")
  end
end
