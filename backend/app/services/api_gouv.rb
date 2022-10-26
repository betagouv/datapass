class ApiGouv < ApplicationService
  def call
    cached_list
  end

  def cached_list
    Rails.cache.fetch("apis_list", expires_in: 2.days) do
      api_gouv_apis
    end
  end

  def api_gouv_apis
    response = Http.instance.get({
      url: "#{api_gouv_host}/api/v1/apis",
      tag: "Api Gouv",
      timeout: 60
    })

    apis_list = response.parse
    apis_list.select { |list| list.include?("datapass_link") }
  end

  private

  def api_gouv_host
    ENV.fetch("API_GOUV_HOST")
  end
end
