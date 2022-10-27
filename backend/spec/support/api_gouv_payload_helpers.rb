module ApiGouvPayloadHelpers
  include WebMock::API

  def stub_api_gouv_apis_call
    stub_request(:get, "https://api.gouv.fr/api/v1/apis")
      .with(
        headers: {
          "Accept" => "application/json",
          "Connection" => "close",
          "Host" => "api.gouv.fr",
          "User-Agent" => "http.rb/5.1.0"
        }
      ).to_return(status: 200, body: api_gouv_lists_payload.to_json, headers: {
        "statut" => 200,
        "Content-Type" => "application/json"
      })
  end

  def api_gouv_lists_payload
    [
      {
        title: "API Impôt particulier",
        tagline: "Raccordez-vous directement à la DGFiP",
        path: "/les-api/impot-particulier",
        slug: "impot-particulier",
        logo: "/images/api-logo/logo-dgfip.jpg",
        datapass_link: "https://datapass.api.gouv.fr/api-impot-particulier-sandbox"
      },
      {
        title: "API Camino",
        tagline: "Ouvrir le cadastre minier pour mieux gérer les projets",
        path: "/les-api/api-camino",
        slug: "api-camino",
        logo: "/images/api-logo/mtes.png",
        datagouv_uuid: ["5dceb39c634f416d5593c858"]
      },
      {
        title: "le.taxi",
        tagline: "Un clic, un taxi",
        path: "/les-api/le-taxi",
        slug: "le-taxi",
        logo: "/images/api-logo/dinum.png",
        datapass_link: "https://datapass.api.gouv.fr/le-taxi-clients"
      }
    ]
  end
end
