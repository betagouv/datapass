module EntrepriseDataPayloadHelpers
  include WebMock::API

  def stub_entreprise_data_etablissement_call(siret)
    stub_request(:get, "https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/#{siret}").to_return(
      status: 200,
      headers: {
        "Content-Type" => "application/json"
      },
      body: entreprise_data_etablissement_payload(siret).to_json
    )
  end

  def entreprise_data_etablissement_payload(siret)
    {
      etablissement: {
        siren: siret.first(9),
        siret: siret,
        etat_administratif: "A",
        denomination_usuelle: nil,
        unite_legale: {
          denomination: "COMMUNE DE CLAMART",
          nom: nil,
          prenom_1: nil,
          prenom_2: nil,
          prenom_3: nil,
          prenom_4: nil
        }
      }
    }
  end
end
