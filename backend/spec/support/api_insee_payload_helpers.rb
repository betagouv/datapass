module ApiInseePayloadHelpers
  include WebMock::API

  def stub_api_insee_etablissement_call(siret)
    stub_request(:post, "#{insee_host}/token").to_return(
      status: 200,
      headers: {
        "Content-Type" => "application/json"
      },
      body: api_insee_token_payload.to_json
    )

    stub_request(:get, "#{insee_host}/entreprises/sirene/V3/siret/#{siret}").to_return(
      status: siret.in?(%w[21920023500014 88301031600015 83951732300011 13002526500013 23974001200012]) ? 200 : 404,
      headers: {
        "Content-Type" => "application/json"
      },
      body: api_insee_etablissement_payload(siret).to_json
    )
  end

  def api_insee_token_payload
    {
      "access_token" => "abc12345-1234-1234-1234-abc123456789",
      "scope" => "am_application_scope default",
      "token_type" => "Bearer",
      "expires_in" => 514532
    }
  end

  def api_insee_etablissement_payload(siret)
    case siret
    when "21920023500014"
      {
        "header" => {
          "statut" => 200,
          "message" => "ok"
        },
        "etablissement" => {
          "siren" => "219200235",
          "nic" => "00014",
          "siret" => "21920023500014",
          "statutDiffusionEtablissement" => "O",
          "dateCreationEtablissement" => "1983-03-01",
          "trancheEffectifsEtablissement" => "41",
          "anneeEffectifsEtablissement" => "2019",
          "activitePrincipaleRegistreMetiersEtablissement" => nil,
          "dateDernierTraitementEtablissement" => "2021-10-27T08:11:21",
          "etablissementSiege" => true,
          "nombrePeriodesEtablissement" => 3,
          "uniteLegale" => {
            "etatAdministratifUniteLegale" => "A",
            "statutDiffusionUniteLegale" => "O",
            "dateCreationUniteLegale" => "1980-01-01",
            "categorieJuridiqueUniteLegale" => "7210",
            "denominationUniteLegale" => "COMMUNE DE CLAMART",
            "sigleUniteLegale" => nil,
            "denominationUsuelle1UniteLegale" => nil,
            "denominationUsuelle2UniteLegale" => nil,
            "denominationUsuelle3UniteLegale" => nil,
            "sexeUniteLegale" => nil,
            "nomUniteLegale" => nil,
            "nomUsageUniteLegale" => nil,
            "prenom1UniteLegale" => nil,
            "prenom2UniteLegale" => nil,
            "prenom3UniteLegale" => nil,
            "prenom4UniteLegale" => nil,
            "prenomUsuelUniteLegale" => nil,
            "pseudonymeUniteLegale" => nil,
            "activitePrincipaleUniteLegale" => "84.11Z",
            "nomenclatureActivitePrincipaleUniteLegale" => "NAFRev2",
            "identifiantAssociationUniteLegale" => nil,
            "economieSocialeSolidaireUniteLegale" => "N",
            "caractereEmployeurUniteLegale" => "O",
            "trancheEffectifsUniteLegale" => "42",
            "anneeEffectifsUniteLegale" => "2019",
            "nicSiegeUniteLegale" => "00014",
            "dateDernierTraitementUniteLegale" => "2021-10-27T08:11:21",
            "categorieEntreprise" => "ETI",
            "anneeCategorieEntreprise" => "2019"
          },
          "adresseEtablissement" => {
            "complementAdresseEtablissement" => "MAIRIE DE CLAMART",
            "numeroVoieEtablissement" => "1",
            "indiceRepetitionEtablissement" => nil,
            "typeVoieEtablissement" => "PL",
            "libelleVoieEtablissement" => "MAURICE GUNSBOURG",
            "codePostalEtablissement" => "92140",
            "libelleCommuneEtablissement" => "CLAMART",
            "libelleCommuneEtrangerEtablissement" => nil,
            "distributionSpecialeEtablissement" => nil,
            "codeCommuneEtablissement" => "92023",
            "codeCedexEtablissement" => "92141",
            "libelleCedexEtablissement" => "CLAMART CEDEX",
            "codePaysEtrangerEtablissement" => nil,
            "libellePaysEtrangerEtablissement" => nil
          },
          "adresse2Etablissement" => {
            "complementAdresse2Etablissement" => nil,
            "numeroVoie2Etablissement" => nil,
            "indiceRepetition2Etablissement" => nil,
            "typeVoie2Etablissement" => nil,
            "libelleVoie2Etablissement" => nil,
            "codePostal2Etablissement" => nil,
            "libelleCommune2Etablissement" => nil,
            "libelleCommuneEtranger2Etablissement" => nil,
            "distributionSpeciale2Etablissement" => nil,
            "codeCommune2Etablissement" => nil,
            "codeCedex2Etablissement" => nil,
            "libelleCedex2Etablissement" => nil,
            "codePaysEtranger2Etablissement" => nil,
            "libellePaysEtranger2Etablissement" => nil
          },
          "periodesEtablissement" => [
            {
              "dateFin" => nil,
              "dateDebut" => "2008-01-01",
              "etatAdministratifEtablissement" => "A",
              "changementEtatAdministratifEtablissement" => false,
              "enseigne1Etablissement" => "MAIRIE",
              "enseigne2Etablissement" => nil,
              "enseigne3Etablissement" => nil,
              "changementEnseigneEtablissement" => false,
              "denominationUsuelleEtablissement" => nil,
              "changementDenominationUsuelleEtablissement" => false,
              "activitePrincipaleEtablissement" => "84.11Z",
              "nomenclatureActivitePrincipaleEtablissement" => "NAFRev2",
              "changementActivitePrincipaleEtablissement" => true,
              "caractereEmployeurEtablissement" => "O",
              "changementCaractereEmployeurEtablissement" => false
            },
            {
              "dateFin" => "2007-12-31",
              "dateDebut" => "1994-12-25",
              "etatAdministratifEtablissement" => "A",
              "changementEtatAdministratifEtablissement" => false,
              "enseigne1Etablissement" => "MAIRIE",
              "enseigne2Etablissement" => nil,
              "enseigne3Etablissement" => nil,
              "changementEnseigneEtablissement" => false,
              "denominationUsuelleEtablissement" => nil,
              "changementDenominationUsuelleEtablissement" => false,
              "activitePrincipaleEtablissement" => "75.1A",
              "nomenclatureActivitePrincipaleEtablissement" => "NAF1993",
              "changementActivitePrincipaleEtablissement" => true,
              "caractereEmployeurEtablissement" => "O",
              "changementCaractereEmployeurEtablissement" => true
            },
            {
              "dateFin" => "1994-12-24",
              "dateDebut" => "1983-03-01",
              "etatAdministratifEtablissement" => "A",
              "changementEtatAdministratifEtablissement" => false,
              "enseigne1Etablissement" => "MAIRIE",
              "enseigne2Etablissement" => nil,
              "enseigne3Etablissement" => nil,
              "changementEnseigneEtablissement" => false,
              "denominationUsuelleEtablissement" => nil,
              "changementDenominationUsuelleEtablissement" => false,
              "activitePrincipaleEtablissement" => nil,
              "nomenclatureActivitePrincipaleEtablissement" => nil,
              "changementActivitePrincipaleEtablissement" => false,
              "caractereEmployeurEtablissement" => nil,
              "changementCaractereEmployeurEtablissement" => false
            }
          ]
        }
      }
    when "88301031600015"
      {
        "header" => {
          "statut" => 200,
          "message" => "ok"
        },
        "etablissement" => {
          "siren" => "883010316",
          "nic" => "00015",
          "siret" => "88301031600015",
          "statutDiffusionEtablissement" => "O",
          "dateCreationEtablissement" => "2018-05-06",
          "trancheEffectifsEtablissement" => nil,
          "anneeEffectifsEtablissement" => nil,
          "activitePrincipaleRegistreMetiersEtablissement" => nil,
          "dateDernierTraitementEtablissement" => "2020-04-23T03:48:22",
          "etablissementSiege" => true,
          "nombrePeriodesEtablissement" => 1,
          "uniteLegale" => {
            "etatAdministratifUniteLegale" => "A",
            "statutDiffusionUniteLegale" => "O",
            "dateCreationUniteLegale" => "2018-05-06",
            "categorieJuridiqueUniteLegale" => "1000",
            "denominationUniteLegale" => nil,
            "sigleUniteLegale" => nil,
            "denominationUsuelle1UniteLegale" => nil,
            "denominationUsuelle2UniteLegale" => nil,
            "denominationUsuelle3UniteLegale" => nil,
            "sexeUniteLegale" => "M",
            "nomUniteLegale" => "PIERRE",
            "nomUsageUniteLegale" => nil,
            "prenom1UniteLegale" => "PAUL",
            "prenom2UniteLegale" => "JACQUES",
            "prenom3UniteLegale" => "JEAN",
            "prenom4UniteLegale" => nil,
            "prenomUsuelUniteLegale" => "PAUL",
            "pseudonymeUniteLegale" => nil,
            "activitePrincipaleUniteLegale" => "70.22Z",
            "nomenclatureActivitePrincipaleUniteLegale" => "NAFRev2",
            "identifiantAssociationUniteLegale" => nil,
            "economieSocialeSolidaireUniteLegale" => nil,
            "caractereEmployeurUniteLegale" => "N",
            "trancheEffectifsUniteLegale" => nil,
            "anneeEffectifsUniteLegale" => nil,
            "nicSiegeUniteLegale" => "00015",
            "dateDernierTraitementUniteLegale" => "2020-04-23T03:48:22",
            "categorieEntreprise" => "PME",
            "anneeCategorieEntreprise" => "2019"
          },
          "adresseEtablissement" => {
            "complementAdresseEtablissement" => "RED NEEDLES",
            "numeroVoieEtablissement" => "63",
            "indiceRepetitionEtablissement" => nil,
            "typeVoieEtablissement" => "RUE",
            "libelleVoieEtablissement" => "DE FRANCE",
            "codePostalEtablissement" => "92140",
            "libelleCommuneEtablissement" => "CLAMART",
            "libelleCommuneEtrangerEtablissement" => nil,
            "distributionSpecialeEtablissement" => nil,
            "codeCommuneEtablissement" => "92023",
            "codeCedexEtablissement" => nil,
            "libelleCedexEtablissement" => nil,
            "codePaysEtrangerEtablissement" => nil,
            "libellePaysEtrangerEtablissement" => nil
          },
          "adresse2Etablissement" => {
            "complementAdresse2Etablissement" => nil,
            "numeroVoie2Etablissement" => nil,
            "indiceRepetition2Etablissement" => nil,
            "typeVoie2Etablissement" => nil,
            "libelleVoie2Etablissement" => nil,
            "codePostal2Etablissement" => nil,
            "libelleCommune2Etablissement" => nil,
            "libelleCommuneEtranger2Etablissement" => nil,
            "distributionSpeciale2Etablissement" => nil,
            "codeCommune2Etablissement" => nil,
            "codeCedex2Etablissement" => nil,
            "libelleCedex2Etablissement" => nil,
            "codePaysEtranger2Etablissement" => nil,
            "libellePaysEtranger2Etablissement" => nil
          },
          "periodesEtablissement" => [
            {
              "dateFin" => nil,
              "dateDebut" => "2018-05-06",
              "etatAdministratifEtablissement" => "A",
              "changementEtatAdministratifEtablissement" => false,
              "enseigne1Etablissement" => nil,
              "enseigne2Etablissement" => nil,
              "enseigne3Etablissement" => nil,
              "changementEnseigneEtablissement" => false,
              "denominationUsuelleEtablissement" => nil,
              "changementDenominationUsuelleEtablissement" => false,
              "activitePrincipaleEtablissement" => "70.22Z",
              "nomenclatureActivitePrincipaleEtablissement" => "NAFRev2",
              "changementActivitePrincipaleEtablissement" => false,
              "caractereEmployeurEtablissement" => "N",
              "changementCaractereEmployeurEtablissement" => false
            }
          ]
        }
      }
    when "83951732300011"
      {
        "header" => {
          "statut" => 200,
          "message" => "ok"
        },
        "etablissement" => {
          "siren" => "839517323",
          "nic" => "00011",
          "siret" => "83951732300011",
          "statutDiffusionEtablissement" => "O",
          "dateCreationEtablissement" => "2018-05-06",
          "trancheEffectifsEtablissement" => nil,
          "anneeEffectifsEtablissement" => nil,
          "activitePrincipaleRegistreMetiersEtablissement" => nil,
          "dateDernierTraitementEtablissement" => "2021-10-16T08:42:44",
          "etablissementSiege" => true,
          "nombrePeriodesEtablissement" => 2,
          "uniteLegale" => {
            "etatAdministratifUniteLegale" => "C",
            "statutDiffusionUniteLegale" => "O",
            "dateCreationUniteLegale" => "2018-05-06",
            "categorieJuridiqueUniteLegale" => "5499",
            "denominationUniteLegale" => "RED NEEDLES",
            "sigleUniteLegale" => nil,
            "denominationUsuelle1UniteLegale" => nil,
            "denominationUsuelle2UniteLegale" => nil,
            "denominationUsuelle3UniteLegale" => nil,
            "sexeUniteLegale" => nil,
            "nomUniteLegale" => nil,
            "nomUsageUniteLegale" => nil,
            "prenom1UniteLegale" => nil,
            "prenom2UniteLegale" => nil,
            "prenom3UniteLegale" => nil,
            "prenom4UniteLegale" => nil,
            "prenomUsuelUniteLegale" => nil,
            "pseudonymeUniteLegale" => nil,
            "activitePrincipaleUniteLegale" => "62.02A",
            "nomenclatureActivitePrincipaleUniteLegale" => "NAFRev2",
            "identifiantAssociationUniteLegale" => nil,
            "economieSocialeSolidaireUniteLegale" => nil,
            "caractereEmployeurUniteLegale" => "N",
            "trancheEffectifsUniteLegale" => nil,
            "anneeEffectifsUniteLegale" => nil,
            "nicSiegeUniteLegale" => "00011",
            "dateDernierTraitementUniteLegale" => "2021-10-16T08:42:44",
            "categorieEntreprise" => "PME",
            "anneeCategorieEntreprise" => "2019"
          },
          "adresseEtablissement" => {
            "complementAdresseEtablissement" => nil,
            "numeroVoieEtablissement" => "64",
            "indiceRepetitionEtablissement" => nil,
            "typeVoieEtablissement" => "RUE",
            "libelleVoieEtablissement" => "DE FRANCE",
            "codePostalEtablissement" => "92140",
            "libelleCommuneEtablissement" => "CLAMART",
            "libelleCommuneEtrangerEtablissement" => nil,
            "distributionSpecialeEtablissement" => nil,
            "codeCommuneEtablissement" => "92023",
            "codeCedexEtablissement" => nil,
            "libelleCedexEtablissement" => nil,
            "codePaysEtrangerEtablissement" => nil,
            "libellePaysEtrangerEtablissement" => nil
          },
          "adresse2Etablissement" => {
            "complementAdresse2Etablissement" => nil,
            "numeroVoie2Etablissement" => nil,
            "indiceRepetition2Etablissement" => nil,
            "typeVoie2Etablissement" => nil,
            "libelleVoie2Etablissement" => nil,
            "codePostal2Etablissement" => nil,
            "libelleCommune2Etablissement" => nil,
            "libelleCommuneEtranger2Etablissement" => nil,
            "distributionSpeciale2Etablissement" => nil,
            "codeCommune2Etablissement" => nil,
            "codeCedex2Etablissement" => nil,
            "libelleCedex2Etablissement" => nil,
            "codePaysEtranger2Etablissement" => nil,
            "libellePaysEtranger2Etablissement" => nil
          },
          "periodesEtablissement" => [
            {
              "dateFin" => nil,
              "dateDebut" => "2020-09-01",
              "etatAdministratifEtablissement" => "F",
              "changementEtatAdministratifEtablissement" => true,
              "enseigne1Etablissement" => nil,
              "enseigne2Etablissement" => nil,
              "enseigne3Etablissement" => nil,
              "changementEnseigneEtablissement" => false,
              "denominationUsuelleEtablissement" => nil,
              "changementDenominationUsuelleEtablissement" => false,
              "activitePrincipaleEtablissement" => "62.02A",
              "nomenclatureActivitePrincipaleEtablissement" => "NAFRev2",
              "changementActivitePrincipaleEtablissement" => false,
              "caractereEmployeurEtablissement" => "N",
              "changementCaractereEmployeurEtablissement" => false
            },
            {
              "dateFin" => "2020-08-31",
              "dateDebut" => "2018-05-06",
              "etatAdministratifEtablissement" => "A",
              "changementEtatAdministratifEtablissement" => false,
              "enseigne1Etablissement" => nil,
              "enseigne2Etablissement" => nil,
              "enseigne3Etablissement" => nil,
              "changementEnseigneEtablissement" => false,
              "denominationUsuelleEtablissement" => nil,
              "changementDenominationUsuelleEtablissement" => false,
              "activitePrincipaleEtablissement" => "62.02A",
              "nomenclatureActivitePrincipaleEtablissement" => "NAFRev2",
              "changementActivitePrincipaleEtablissement" => false,
              "caractereEmployeurEtablissement" => "N",
              "changementCaractereEmployeurEtablissement" => false
            }
          ]
        }
      }
    when "13002526500013", "23974001200012"
      {
        "etablissement" => {
          "siren" => siret.first(9),
          "siret" => siret,
          "uniteLegale" => {
            "denominationUniteLegale" => "DEFAULT ORGANIZATION",
            "nomUniteLegale" => nil,
            "prenom1UniteLegale" => nil,
            "prenom2UniteLegale" => nil,
            "prenom3UniteLegale" => nil,
            "prenom4UniteLegale" => nil
          },
          "periodesEtablissement" => [{
            "etatAdministratifEtablissement" => "A",
            "activitePrincipaleEtablissement" => "84.11Z",
            "denominationUsuelleEtablissement" => nil
          }],
          "adresseEtablissement" => {}
        }
      }
    else
      {
        header: {
          statut: 404,
          message: "Aucun élément trouvé pour le siret #{siret}"
        }
      }
    end
  end

  private

  def insee_host
    ENV.fetch("INSEE_HOST")
  end
end
