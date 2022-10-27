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

    # Filter apis list and select information to display for Datapass
    results = apis_list
      .select { |list| list.include?("datapass_link") }
      .map do |hash|
      {title: hash["title"], tagline: hash["tagline"], path: hash["path"], slug: hash["slug"], logo: hash["logo"], datapass_link: hash["datapass_link"]}
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
      datapass_link: "https://datapass.api.gouv.fr/api-impot-particulier-fc-sandbox"
    }
  end
end
