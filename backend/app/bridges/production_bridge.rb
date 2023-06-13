# frozen_string_literal: true

class ProductionBridge < ApplicationBridge
  def call
    id = @enrollment.id
    demandeur = @enrollment.demandeurs.first
    identifiant_sandbox = @enrollment[:previous_enrollment_id]
    identifiant_production_old = @enrollment[:copied_from_enrollment_id]
    siret = @enrollment[:siret]
    created_at = @enrollment[:created_at]
    submit_event = @enrollment.events.find { |event| event["name"] == "submit" }
    validate_event = @enrollment.events.find { |event| event["name"] == "validate" }
    validated_at = @enrollment.validated_at
    cadre_juridique_title = @enrollment[:fondement_juridique_title].gsub(/(\r?\n|\r)/, " ")
    fondement_juridique_url = @enrollment[:fondement_juridique_url]
    document_juridique = @enrollment.documents.find { |doc| doc["type"] == "Document::LegalBasis" }
    homologation = @enrollment[:additional_content]
    document_homologation = @enrollment.documents.find { |doc| doc["type"] == "Document::DecisionHomologation" }

    linked_token_manager_id = create_enrollment_in_token_manager(
      id,
      demandeur,
      identifiant_sandbox,
      identifiant_production_old,
      siret,
      created_at,
      submit_event,
      validate_event,
      validated_at,
      cadre_juridique_title,
      fondement_juridique_url,
      document_juridique,
      homologation,
      document_homologation
    )
    @enrollment.update({linked_token_manager_id: linked_token_manager_id})
  end

  private

  def api_dgfip_host
    ENV.fetch("DGFIP_HOST")
  end

  def client_id
    ENV.fetch("DGFIP_CLIENT_ID")
  end

  def client_secret
    ENV.fetch("DGFIP_CLIENT_SECRET")
  end

  def filter_special_characters(string)
    special_characters = /[^a-zA-Z0-9\sàâäçèéêëîïôöùûüÿÂÊÎÔÛÄËÏÖÜÀÇÉÈÙ]/
    string.gsub(special_characters, "")
  end

  def create_enrollment_in_token_manager(
    id,
    demandeur,
    identifiant_sandbox,
    identifiant_production_old,
    siret,
    created_at,
    submit_event,
    validate_event,
    validated_at,
    cadre_juridique_title,
    fondement_juridique_url,
    document_juridique,
    homologation,
    document_homologation
  )
    # 1.1 Get Valideur Person Siren and Info
    siren = siret.first(9)
    valideur_id = validate_event[:user_id]
    valideur = User.find_by(id: valideur_id)
    valideur_siren = valideur.organizations[0]["siret"].first(9)

    # 1.2 Cadre Juridique document URl
    unless document_juridique.nil?
      document_url = "#{ENV["BACK_HOST"]} + #{document_juridique.attachment.url}"
    end
    cadre_juridique_url = fondement_juridique_url.present? ? fondement_juridique_url : document_url

    # 1.3 Homologation document url
    homologation_document_url = "#{ENV["BACK_HOST"]}#{document_homologation.attachment.url}"

    # 1.4 identifiantProductionOld
    id_production_old = identifiant_production_old.present? ? identifiant_production_old : nil

    # 2 get token

    token_response = Http.instance.post({
      url: "#{api_dgfip_host}/token",
      api_key: Base64.strict_encode64("#{client_id}:#{client_secret}"),
      use_basic_auth_method: true,
      use_form_content_type: true,
      tag: "Api Contractualisation DGFiP (sandbox)",
      body: {grant_type: "client_credentials"}
    })

    token = token_response.parse
    access_token = token["access_token"]

    # 3 Post Info to DGFIP
    Http.instance.post({
      url: "#{api_dgfip_host}/contractualisation/v1/production/#{id}",
      api_key: access_token,
      use_correlation_id: true,
      tag: "Api Contractualisation DGFiP (production)",
      body: {
        identifiantSandbox: identifiant_sandbox,
        identifiantProductionOld: id_production_old,
        demande: {
          demandeur: {
            mail: demandeur[:email],
            telephone: demandeur[:phone_number].gsub(/[^\d+]/, ""),
            denominationEtatCivil: {
              nom: demandeur[:family_name],
              prenom: demandeur[:given_name]
            },
            denominationService: demandeur[:job],
            balf: nil,
            siren: siren
          },
          valideur: {
            mail: valideur[:email],
            telephone: valideur[:phone_number].gsub(/[^\d+]/, ""),
            denominationEtatCivil: {
              nom: valideur[:family_name],
              prenom: valideur[:given_name]
            },
            denominationService: valideur[:job],
            balf: nil,
            siren: valideur_siren
          },
          dateCreation: created_at.iso8601,
          dateSoumission: submit_event[:created_at].iso8601,
          dateValidation: validated_at.iso8601
        },
        cadreJuridique: {
          nature: filter_special_characters(cadre_juridique_title.first(255)),
          documentUrl: cadre_juridique_url,
          texteUrl: nil
        },
        homologation: {
          nomAutorite: homologation["autorite_homologation_nom"],
          fonctionAutorite: homologation["autorite_homologation_fonction"],
          dateDebut: homologation["date_homologation"],
          dateFin: homologation["date_fin_homologation"],
          documentUrl: homologation_document_url,
          texteUrl: nil
        },
        quota: homologation["volumetrie_appels_par_minute"].to_i,
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
