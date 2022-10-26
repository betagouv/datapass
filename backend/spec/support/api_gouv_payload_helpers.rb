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
        "title" => "API Ingres - Nomenclatures",
        "tagline" => "Récupérez l'ensemble des référentiels utilisés par les Systèmes d'Information des Ressources Humaines",
        "path" => "/les-api/API_Ingres_Nomenclatures",
        "slug" => "API_Ingres_Nomenclatures",
        "openness" => "closed",
        "owner" => "Centre Interministériel des Systèmes d'Information relatifs aux Ressources Humaines",
        "owner_acronym" => "CISIRH",
        "logo" => "/images/api-logo/logo-cisirh.png",
        "datapass_link" => "https://datapass.api.gouv.fr/api_ingres"
      },
      {
        "title" => "Légifrance Bêta",
        "tagline" => "Réutilisation des données juridiques disponibles sur le site Légifrance",
        "path" => "/les-api/DILA_api_Legifrance",
        "slug" => "DILA_api_Legifrance",
        "openness" => "semi_open",
        "owner" => "Direction de l'information légale et administrative",
        "owner_acronym" => "DILA",
        "logo" => "/images/api-logo/dila.png",
        "datagouv_uuid" => ["53ae8af9a3a729709f56d50c"]
      },
      {
        "title" => "API Camino",
        "tagline" => "Ouvrir le cadastre minier pour mieux gérer les projets",
        "path" => "/les-api/api-camino",
        "slug" => "api-camino",
        "openness" => "open",
        "owner" => "Ministère de la Transition écologique et solidaire",
        "owner_acronym" => "MTES",
        "logo" => "/images/api-logo/mtes.png",
        "datagouv_uuid" => ["5dceb39c634f416d5593c858"]
      },
      {
        "title" => "API CaptchEtat",
        "tagline" => "Générer un CAPTCHA pour sécuriser un service en ligne",
        "path" => "/les-api/api-captchetat",
        "slug" => "api-captchetat",
        "openness" => "closed",
        "owner" => "Agence pour l'informatique financière de l'État",
        "owner_acronym" => "AIFE",
        "logo" => "/images/api-logo/ChorusPro.jpg",
        "datapass_link" => "https://datapass.api.gouv.fr/api-captchetat"
      }
    ]
  end
end
