class ApiSirene < ApplicationService
  def initialize(siret)
    @siret = siret
  end

  def call
    cached_etablissement
  end

  def cached_etablissement
    Rails.cache.fetch("etablissements/#{@siret}", expires_in: 12.hours) do
      etablissement
    end
  end

  def etablissement
    begin
      response = Http.instance.get({
        url: "#{insee_host}/entreprises/sirene/V3/siret/#{@siret}",
        api_key: cached_access_token,
        tag: "API Insee"
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

    etablissement = response.parse["etablissement"]
    is_diffusable = etablissement["statutDiffusionEtablissement"] == "O"

    unless is_diffusable
      return nil
    end

    last_periode_etablissement = etablissement["periodesEtablissement"][0]
    etat_administratif = last_periode_etablissement["etatAdministratifEtablissement"]

    if etat_administratif != "A"
      return {
        nom_raison_sociale: nil,
        siret: @siret,
        denomination: nil,
        sigle: nil,
        adresse: nil,
        code_postal: nil,
        code_commune: nil,
        libelle_commune: nil,
        activite_principale: nil,
        activite_principale_label: nil,
        categorie_juridique: nil,
        categorie_juridique_label: nil,
        etat_administratif: etat_administratif
      }
    end

    unite_legale = etablissement["uniteLegale"]
    adresse_etablissement = etablissement["adresseEtablissement"]

    nom_raison_sociale = unite_legale["denominationUniteLegale"]
    nom_raison_sociale ||= last_periode_etablissement["denominationUsuelleEtablissement"]
    nom = unite_legale["nomUniteLegale"]
    prenom_1 = unite_legale["prenom1UniteLegale"]
    prenom_2 = unite_legale["prenom2UniteLegale"]
    prenom_3 = unite_legale["prenom3UniteLegale"]
    prenom_4 = unite_legale["prenom4UniteLegale"]
    nom_raison_sociale ||= [prenom_1, prenom_2, prenom_3, prenom_4, nom].reject(&:nil?).join(" ")

    numero_voie = adresse_etablissement["numeroVoieEtablissement"]
    indice_repetition = adresse_etablissement["indiceRepetitionEtablissement"]
    type_voie = adresse_etablissement["typeVoieEtablissement"]
    libelle_voie = adresse_etablissement["libelleVoieEtablissement"]
    adresse = [numero_voie, indice_repetition, type_voie, libelle_voie].reject(&:nil?).join(" ")

    denomination = unite_legale["denominationUniteLegale"]
    sigle = unite_legale["sigleUniteLegale"]
    code_postal = adresse_etablissement["codePostalEtablissement"]
    code_commune = adresse_etablissement["codeCommuneEtablissement"]
    libelle_commune = adresse_etablissement["libelleCommuneEtablissement"]
    activite_principale = last_periode_etablissement["activitePrincipaleEtablissement"]
    activite_principale ||= unite_legale["activitePrincipaleUniteLegale"]
    activite_principale_label = codes_naf[activite_principale.delete(".")]
    categorie_juridique = unite_legale["categorieJuridiqueUniteLegale"]
    categorie_juridique_label = categories_juridiques[categorie_juridique]

    {
      nom_raison_sociale: nom_raison_sociale,
      siret: @siret,
      denomination: denomination,
      sigle: sigle,
      adresse: adresse,
      code_postal: code_postal,
      code_commune: code_commune,
      libelle_commune: libelle_commune,
      activite_principale: activite_principale,
      activite_principale_label: activite_principale_label,
      categorie_juridique: categorie_juridique,
      categorie_juridique_label: categorie_juridique_label,
      etat_administratif: etat_administratif
    }
  end

  private

  def insee_host
    ENV.fetch("INSEE_HOST")
  end

  def insee_consumer_key
    ENV.fetch("INSEE_CONSUMER_KEY")
  end

  def insee_consumer_secret
    ENV.fetch("INSEE_CONSUMER_SECRET")
  end

  def codes_naf
    JSON.parse(File.read("./public/codes_naf.json"))
  end

  def categories_juridiques
    JSON.parse(File.read("./public/categories_juridiques_20200701.json"))
  end

  def get_token
    token_response = Http.instance.post({
      url: "#{insee_host}/token",
      body: {grant_type: "client_credentials"},
      api_key: Base64.strict_encode64("#{insee_consumer_key}:#{insee_consumer_secret}"),
      use_basic_auth_method: true,
      use_form_content_type: true,
      tag: "API Insee"
    })
    token_response.parse
  end

  def cached_access_token
    cached_access_token = Rails.cache.read("insee/access_token")

    if cached_access_token.nil?
      token = get_token
      Rails.cache.write("insee/access_token", token["access_token"], expires_in: 0)
      token["access_token"]
    else
      cached_access_token
    end
  end
end
