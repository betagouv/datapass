class ApiGouv < ApplicationService
  def call
    cached_list
  end

  def cached_list
    Rails.cache.fetch("apis", expires_in: 2.days) do
      api_gouv_apis
    end
  end

  def api_gouv_apis
    response = Http.instance.get({
      url: "#{api_gouv_host}/api/v1/apis",
      tag: "Api Gouv",
      timeout: 60
    })

    apis = response.parse

    # Filter apis list and select information only regarding Datapass.
    # Rename datapass_link into pass_path to match front end
    filtered_apis = apis
      .select { |api| api.include?("datapass_link") }
      .map do |api|
      {
        title: api["title"],
        slug: api["slug"],
        tagline: api["tagline"],
        path: api["path"],
        logo: api["logo"],
        pass_path: URI(api["datapass_link"]).path
      }
    end

    # Add Impot particulier fc hash in api list as it is not generated in the api.gouv.fr/api/v1/ endpoint
    impot_part_fc = filtered_apis.find { |api| api[:slug] === "impot-particulier" }
      .merge(impot_particulier_fc)

    filtered_apis << impot_part_fc
  end

  private

  def api_gouv_host
    ENV.fetch("API_GOUV_HOST")
  end

  def impot_particulier_fc
    {
      title: "API Impôt particulier via FranceConnect",
      slug: "impot-particulier-fc",
      pass_path: "/api-impot-particulier-fc-sandbox"
    }
  end
end
