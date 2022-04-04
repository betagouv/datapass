class ApiSirene < ApplicationService
  def initialize(siret)
    @siret = siret
  end

  def call
    response = HTTP.get("https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/#{@siret}")

    if !response.status.success? || response.parse["etablissement"]["etat_administratif"] != "A"
      return nil
    end

    etat_administratif = response.parse["etablissement"]["etat_administratif"]

    nom_raison_sociale = response.parse["etablissement"]["unite_legale"]["denomination"]
    nom_raison_sociale ||= response.parse["etablissement"]["denomination_usuelle"]
    nom = response.parse["etablissement"]["unite_legale"]["nom"]
    prenom_1 = response.parse["etablissement"]["unite_legale"]["prenom_1"]
    prenom_2 = response.parse["etablissement"]["unite_legale"]["prenom_2"]
    prenom_3 = response.parse["etablissement"]["unite_legale"]["prenom_3"]
    prenom_4 = response.parse["etablissement"]["unite_legale"]["prenom_4"]
    nom_raison_sociale ||= [prenom_1, prenom_2, prenom_3, prenom_4, nom].reject(&:nil?).join(" ")

    numero_voie = response.parse["etablissement"]["numero_voie"]
    indice_repetition = response.parse["etablissement"]["indice_repetition"]
    type_voie = response.parse["etablissement"]["type_voie"]
    libelle_voie = response.parse["etablissement"]["libelle_voie"]
    adresse = [numero_voie, indice_repetition, type_voie, libelle_voie].reject(&:nil?).join(" ")

    denomination = response.parse["etablissement"]["unite_legale"]["denomination"]
    sigle = response.parse["etablissement"]["unite_legale"]["sigle"]
    code_postal = response.parse["etablissement"]["code_postal"]
    code_commune = response.parse["etablissement"]["code_commune"]
    libelle_commune = response.parse["etablissement"]["libelle_commune"]
    activite_principale = response.parse["etablissement"]["activite_principale"]
    activite_principale ||= response.parse["etablissement"]["unite_legale"]["activite_principale"]
    activite_principale_label = codes_naf[activite_principale.delete(".")]
    categorie_juridique = response.parse["etablissement"]["unite_legale"]["categorie_juridique"]
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

  def codes_naf
    JSON.parse(File.read("./public/codes_naf.json"))
  end

  def categories_juridiques
    JSON.parse(File.read("./public/categories_juridiques_20200701.json"))
  end
end
