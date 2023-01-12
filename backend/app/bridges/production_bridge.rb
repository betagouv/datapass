# frozen_string_literal: true

class ProductionBridge < ApplicationBridge
  def call
    demandeur = @enrollment.demandeurs.first
    identifiantSandbox = @enrollment[:previous_enrollment_id]
    siret = @enrollment[:siret]
    created_at = @enrollment[:created_at]
    submit_event = @enrollment.events.find { |event| event["name"] == "submit" }
    validate_event = @enrollment.events.find { |event| event["name"] == "validate" }
    validated_at = @enrollment.validated_at
    cadre_juridique_title = @enrollment[:fondement_juridique_title]
    fondement_juridique_url = @enrollment[:fondement_juridique_url]
    document_juridique = @enrollment.documents.find { |doc| doc["type"] == "Document::LegalBasis" }
    homologation = @enrollment[:additional_content]
    document_homologation = @enrollment.documents.find { |doc| doc["type"] == "Document::DecisionHomologation" }
    quota = @enrollment[:volumetrie_approximative]

    linked_token_manager_id = create_enrollment_in_token_manager(
      @enrollment.id,
      demandeur,
      identifiantSandbox,
      siret,
      created_at,
      submit_event,
      validate_event,
      validated_at,
      cadre_juridique_title,
      fondement_juridique_url,
      document_juridique,
      homologation,
      document_homologation,
      quota
    )
    @enrollment.update({linked_token_manager_id: linked_token_manager_id})
  end

  private

  def create_enrollment_in_token_manager(
    id,
    demandeur,
    identifiantSandbox,
    siret,
    created_at,
    submit_event,
    validate_event,
    validated_at,
    cadre_juridique_title,
    fondement_juridique_url,
    document_juridique,
    homologation,
    document_homologation,
    quota
  )
    # 1.1 Get Validateur Person Siren and Info
    siren = siret.first(9)
    validateur_id = validate_event[:user_id]
    validateur = User.find_by(id: validateur_id)

    # 1.2 Transform document in URl
    document_url = "#{ENV["BACK_HOST"]} + #{document_juridique.attachment.url}"
    cadre_juridique_url = fondement_juridique_url.exist? ? fondement_juridique_url : document_url

    # 1.3 Fill all Homologation info
    nom_autorite = homologation["autorite_homologation_nom"]
    fonction_autorite = homologation["autorite_homologation_fonction"]
    date_debut = homologation["date_homologation"]
    date_fin = homologation["date_fin_homologation"]
    homologation_document_url = "#{ENV["BACK_HOST"]} + #{document_homologation.attachment.url}"

    # Comment recupérer les données volumetrie approximative généré en front (nbr appels minutes)

    # 2 get token
    api_dgfip_host = ENV.fetch("DGFIP_HOST")
    dgfip_auth_url = ENV.fetch("DGFIP_AUTH_URL")
    client_id = ENV.fetch("DGFIP_CLIENT_ID")
    client_secret = ENV.fetch("DGFIP_CLIENT_SECRET")

    token_response = Http.instance.post({
      url: dgfip_auth_url,
      body: {grant_type: "client_credentials", scope: "ADMIN"},
      authorization: Base64.strict_encode64("#{client_id}:#{client_secret}"),
      use_basic_auth_method: true,
      tag: "sandbox"
    })

    token = token_response.parse
    access_token = token["access_token"]

    # 3 Post Info to DGFIP
    Http.instance.post({
      url: "#{api_dgfip_host}/contractualisation/v1/production/#{identifiant}",
      api_key: access_token,
      use_basic_auth_method: true,
      body: {
        identifiantSandBox: identifiantSandbox,
        identifiantProductionOld: id,
        demande: {
          demandeur: {
            mail: demandeur[:email],
            telephone: demandeur[:phone_number].gsub(/\D/, ""),
            denominationEtatCivil: {
              nom: demandeur[:family_name],
              prenom: demandeur[:given_name]
            },
            denominationService: demandeur[:job],
            balf: nil,
            siren: siren
          },
          valideur: {
            mail: validateur[:email],
            telephone: validateur[:phone_number].gsub(/\D/, ""),
            denominationEtatCivil: {
              nom: validateur[:family_name],
              prenom: validateur[:given_name]
            },
            denominationService: validateur[:job],
            balf: nil,
            siren: "130004955"
          },
          dateCreation: created_at.iso8601,
          dateSoumission: submit_event[:created_at].iso8601,
          dateValidation: validated_at.iso8601
        },
        cadreJuridique: {
          nature: cadre_juridique_title,
          texteDocument: {
            fichier: cadre_juridique_url,
            extension: nil,
            nom: nil
          },
          texteUrl: nil
        },
        homologation: {
          nomAutorite: nom_autorite,
          fonctionAutorite: fonction_autorite,
          dateDebut: date_debut,
          dateFin: date_fin,
          documentUrl: homologation_document_url,
          texteUrl: nil
        },
        quota: 0,
        attestationRecette: true,
        attestationRGPD: true,
        cgu: {
          libelle: "Libellé du CGU",
          version: "Version des CGU validées",
          attestationCGU: true
        }
      }
    })
  end
end
