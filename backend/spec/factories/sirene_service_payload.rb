FactoryBot.define do
  factory :sirene_service_payload, class: Hash do
    initialize_with { attributes.symbolize_keys }

    nom_raison_sociale { "Raison sociale" }
    siret { Faker::Company.french_siret_number }
    denomination { "Dénomination" }
    sigle { "Sigle" }
    adresse { "Adresse" }
    code_postal { "75007" }
    code_commune { "75107" }
    libelle_commune { "PARIS 7" }
    activite_principale { "84.11Z" }
    activite_principale_label { "Administration publique générale" }
    categorie_juridique { "7120" }
    categorie_juridique_label { "Service central d'un ministère" }
    etat_administratif { "A" }

    trait :dinum do
      nom_raison_sociale { "DIRECTION INTERMINISTERIELLE DU NUMERIQUE" }
      siret { "13002526500013" }
      denomination { "DIRECTION INTERMINISTERIELLE DU NUMERIQUE" }
      sigle { "DINUM" }
      adresse { "20 AV DE SEGUR" }
    end
  end
end
