require "uri"

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

    response.parse
    apis_list = response.parse

    # Filter apis list and select information only regarding Datapass.
    # remove Datapass_link prefix to keep only "target_api" to redirect to correct address of Api form
    results = apis_list
      .select { |list| list.include?("datapass_link") }
      .map do |hash|
      {title: hash["title"], slug: hash["slug"], tagline: hash["tagline"], path: hash["path"], logo: hash["logo"], datapass_link: URI(hash["datapass_link"]).path}
    end

    # Add Impot particulier fc hash in apis_list as it is not generate in the api.gouv.fr/api/v1/apis list.
    impot_part_fc = results.find { |api| api[:slug] === "impot-particulier" }
      .merge(impot_particulier_fc)

    results << impot_part_fc
  end

  private

  def api_gouv_host
    ENV.fetch("API_GOUV_HOST")
  end

  def impot_particulier_fc
    {
      title: "API Impôt particulier via FranceConnect",
      datapass_link: "/api-impot-particulier-fc-sandbox"
    }
  end
end
