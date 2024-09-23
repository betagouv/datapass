# frozen_string_literal: true

module ProductionPayloadHelpers
  include WebMock::API

  def stub_production_bridge_call
    api_dgfip_host = ENV.fetch("DGFIP_HOST")

    stub_request(:post, "#{api_dgfip_host}/contractualisation/v1/production/957")
      # api_key: access_token,
      # use_basic_auth_method: true)
      # .with(
      #   status: 200
      # )
      .to_return(
        status: 200,
        body: production_bridge_payload.to_json,
        headers: {
          "status" => 200,
          "Content-Type" => "application/json"
        }
      )
  end

  def production_bridge_payload
    {
      identifiantSandBox: "956",
      identifiantProductionOld: nil,
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
      cadreJuridique: {
        nature: "- Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016...",
        documentUrl: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039362321/2019-11-10",
        texteUrl: nil
      },
      homologation: {
        nomAutorite: "Thales",
        fonctionAutorite: "Test",
        dateDebut: "01/01/2023",
        dateFin: "01/02/2023",
        documentUrl: "https://localhost:3001/uploads/document/decision_homologation/attachment/1/test_homologation.pdf",
        texteUrl: nil
      },
      quota: 200,
      attestationRecette: true,
      attestationRGPD: true,
      cgu: {
        libelle: "Libellé du CGU",
        version: "Version des CGU validées",
        attestationCGU: true
      }
    }
  end
end
