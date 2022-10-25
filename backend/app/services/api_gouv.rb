class ApiGouv < ApplicationService
  def call
    cached_list
  end

  def cached_list
    Rails.cache.fetch("apis_list", expires_in: 7.days) do
      api_gouv_apis
    end
  end

  def api_gouv_apis
    begin
      response = Http.instance.get({
        url: "#{api_gouv_host}/api/v1/apis",
        tag: "Api Gouv",
        timeout: 60
      })
    rescue ApplicationController::BadGateway => e
      if e.http_code == 404
        return nil
      elsif e.http_code == 403
        return nil
      else
        raise
      end
    end

    apis_list = response.parse
    apis_list.select { |list| list["openness"] == "closed" && list.include?("datapass_link") }
  end

  private

  def api_gouv_host
    ENV.fetch("API_GOUV_HOST")
  end
end
