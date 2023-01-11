# frozen_string_literal: true

class SandboxBridge < ApplicationBridge
  def call
    demandeur = @enrollment.demandeurs.first
    responsable_technique = @enrollment.team_members.find { |team_member| team_member["type"] == "responsable_technique" }
    responsable_traitement = @enrollment.team_members.find { |team_member| team_member["type"] == "responsable_traitement" }
    dpd = @enrollment.team_members.find { |team_member| team_member["type"] == "delegue_protection_donnees" }
    siret = @enrollment[:siret]
    created_at = @enrollment[:created_at]
    submit_event = @enrollment.events.find { |event| event["name"] == "submit" }
    validated_at = @enrollment.validated_at
    cas_usage_libelle = @enrollment[:intitule]
    cas_usage_detail = @enrollment[:description]
    cadre_juridique_title = @enrollment[:fondement_juridique_title]
    fondement_juridique_url = @enrollment[:fondement_juridique_url]
    url_document_juridique = @enrollment.documents.find { |doc| doc["type"] == "Document::LegalBasis" }
    rgpd_destinataires = @enrollment[:data_recipients]
    duree_conservation_donnee_valeur = @enrollment[:data_retention_period]
    justificatif = @enrollment[:data_retention_comment]

    linked_token_manager_id = create_enrollment_in_token_manager(
      @enrollment.id,
      demandeur,
      responsable_technique,
      responsable_traitement,
      dpd,
      siret,
      created_at,
      submit_event,
      validated_at,
      cas_usage_libelle,
      cas_usage_detail,
      cadre_juridique_title,
      fondement_juridique_url,
      url_document_juridique,
      rgpd_destinataires,
      duree_conservation_donnee_valeur,
      justificatif
    )
    @enrollment.update({linked_token_manager_id: linked_token_manager_id})
  end

  private

  def create_enrollment_in_token_manager(
    id,
    demandeur,
    responsable_technique,
    responsable_traitement,
    dpd,
    siret,
    created_at,
    submit_event,
    validated_at,
    cas_usage_libelle,
    cas_usage_detail,
    cadre_juridique_title,
    fondement_juridique_url,
    url_document_juridique,
    rgpd_destinataires,
    duree_conservation_donnee_valeur,
    justificatif
  )

    # 1 call ApiSiren
    response = ApiSirene.call(siret)

    siren = siret.first(9)
    libelle = response[:nom_raison_sociale]
    adresse = response[:adresse]
    adresse_2 = nil
    adresse_3 = nil
    code_postal = response[:code_postal]
    ville = response[:libelle_commune]

    # 1.1 Get Validateur Person Siren and Info
    validateur_id = submit_event[:user_id]
    validateur = User.find_by(id: validateur_id)

    # 1.2 Trasnform document in URl
    document = "#{ENV["BACK_HOST"]} + #{url_document_juridique.attachment.url}"
    cadre_juridique_url = fondement_juridique_url.exist? ? fondement_juridique_url : document

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

    # 3 Send Info to DGFIP
    Http.instance.post({url: "#{api_dgfip_host}/contractualisation/v1/sandbox/#{identifiant}",
      api_key: access_token,
      use_basic_auth_method: true,
      body: {
        identifiantSandBoxOld: id,
        organisation: {
          siren: siren,
          libelle: libelle,
          adresse: {
            ligne1: adresse,
            ligne2: adresse_2,
            ligne3: adresse_3,
            codePostal: code_postal,
            ville: ville,
            pays: "France"
          }
        },
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
        casUsage: {
          libelle: cas_usage_libelle,
          detail: cas_usage_detail
        },
        responsable_technique: {
          mail: responsable_technique[:email],
          telephone: responsable_technique[:phone_number].gsub(/\D/, ""),
          denominationEtatCivil: {
            nom: responsable_technique[:family_name],
            prenom: responsable_technique[:given_name]
          },
          denominationService: responsable_technique[:job],
          balf: nil,
          siren: nil
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
        attestationRGPD: true,
        rgpd: {
          destinataires: rgpd_destinataires,
          dureeConservationDonnees: {
            valeur: duree_conservation_donnee_valeur,
            unite: "mois",
            justificatif: justificatif
          }
        },
        responsableTraitement: {
          mail: responsable_traitement[:email],
          telephone: responsable_traitement[:phone_number].gsub(/\D/, ""),
          denominationEtatCivil: {
            nom: responsable_traitement[:family_name],
            prenom: responsable_traitement[:given_name]
          },
          denominationService: responsable_traitement[:job],
          balf: nil,
          siren: nil
        },
        dpd: {
          mail: dpd[:email],
          telephone: dpd[:phone_number].gsub(/\D/, ""),
          denominationEtatCivil: {
            nom: dpd[:family_name],
            prenom: dpd[:given_name]
          },
          denominationService: dpd[:job],
          balf: nil,
          siren: nil
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
      }})
  end
end
