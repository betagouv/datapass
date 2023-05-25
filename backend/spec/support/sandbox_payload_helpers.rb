# frozen_string_literal: true

module SandboxPayloadHelpers
  include WebMock::API

  def stub_sandbox_bridge_call
    api_dgfip_host = ENV.fetch("DGFIP_HOST")

    stub_request(:post, "#{api_dgfip_host}/contractualisation/v1/sandbox/956")
      api_key: access_token,
      use_basic_auth_method: true,
      .with(
        status: 200
      )
      .to_return(
        status: 200,
        body: sandbox_bridge_payload.to_json,
        headers: {
          "status" => 200,
          "Content-Type" => "application/json"
        }
      )
  end

  def sandbox_bridge_payload
    {
      identifiantSandBoxOld: nil,
      organisation: {
        siren: 219200235,
        libelle: "COMMUNE DE CLAMART",
        adresse: {
          ligne1: "1 PL MAURICE GUNSBOURG",
          ligne2: nil,
          ligne3: nil,
          codePostal: "92140",
          ville: "CLAMART",
          pays: "France"
        }
      },
      demande: {
        demandeur: {
          mail: "Lagaff@whatever.gouv.fr",
          telephone: "0687463489",
          denominationEtatCivil: {
            nom: "Lagaff",
            prenom: "Gaston"
          },
          denominationService: "Responsable des moyens internes",
          balf: nil,
          siren: "219200235"
        },
        valideur: {
          mail: "Mesmaeker@whatever.gouv.fr",
          telephone: "0726347761",
          denominationEtatCivil: {
            nom: "de Mesmaeker",
            prenom: "Monsieur"
          },
          denominationService: "instructeur",
          balf: nil,
          siren: "130004955"
        },
        dateCreation: "2023-01-12T09:06:56Z",
        dateSoumission: "2023-01-12T09:06:56Z",
        dateValidation: "2023-01-23T15:09:55.871Z"
      },
      casUsage: {
        libelle: "Dites-le nous une fois - Place en crèche",
        detail: "Simplification des demandes de place en crèche pour les usagers..."
      },
      responsableTechnique: {
        mail: "lebrac@whatever.gouv.fr",
        telephone: "0634890123",
        denominationEtatCivil: {
          nom: "Lebrac",
          prenom: "Yves"
        },
        denominationService: "Ingénieur - chef projet informatique",
        balf: nil,
        siren: "219200235"
      },
      cadreJuridique: {
        nature: "- Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016...",
        documentUrl: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039362321/2019-11-10",
        texteUrl: nil
      },
      attestationRGPD: true,
      rgpd: {
        destinataires: "Agents gestionnaires de l'enfance",
        dureeConservationDonnees: {
          valeur: "120",
          unite: "mois",
          justificatif: "Justif. DUA : il s'agit de pièces justificatives comptables..."
        },
        responsableTraitement: {
          mail: "prunelle@whatever.gouv.fr",
          telephone: "0612345678",
          denominationEtatCivil: {
            nom: "Prunelle",
            prenom: "Leon"
          },
          denominationService: "Responsable administrative et finances",
          balf: nil,
          siren: "219200235"
        },
        dpd: {
          mail: "jeanne@whatever.gouv.fr",
          telephone: "0123456789",
          denominationEtatCivil: {
            nom: "Madmoizelle",
            prenom: "Jeanne"
          },
          denominationService: "Délégué à la protection des données personnelles",
          balf: nil,
          siren: "219200235"
        }
      },
      cgu: {
        libelle: "Libellé du CGU",
        version: "Version des CGU validées",
        attestationCGU: true
      },
      apiSouscrites: [
        {
          ressources: [
            {
              restrictions: [
                nil
              ],
              libelle: nil,
              code: nil
            }
          ],
          version: "a remplir par DGFIP",
          code: "Nom de L'API"
        }
      ]
    }
  end
end
