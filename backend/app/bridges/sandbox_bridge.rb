# frozen_string_literal: true

class SandboxBridge < ApplicationBridge
  def call
    id = @enrollment.id
    demandeur = @enrollment.demandeurs.first
    responsable_technique = @enrollment.team_members.find { |team_member| team_member["type"] == "responsable_technique" }
    responsable_traitement = @enrollment.team_members.find { |team_member| team_member["type"] == "responsable_traitement" }
    dpd = @enrollment.team_members.find { |team_member| team_member["type"] == "delegue_protection_donnees" }
    siret = @enrollment[:siret]
    created_at = @enrollment[:created_at]
    submit_event = @enrollment.events.find { |event| event["name"] == "submit" }
    validate_event = @enrollment.events.find { |event| event["name"] == "validate" }
    validated_at = @enrollment.validated_at
    cas_usage_libelle = @enrollment[:intitule].gsub(/(\r?\n|\r)/, " ")
    cas_usage_detail = @enrollment[:description].gsub(/(\r?\n|\r)/, " ")
    cadre_juridique_title = @enrollment[:fondement_juridique_title].gsub(/(\r?\n|\r)/, " ")
    fondement_juridique_url = @enrollment[:fondement_juridique_url]
    document_juridique = @enrollment.documents.find { |doc| doc["type"] == "Document::LegalBasis" }
    rgpd_destinataires = @enrollment[:data_recipients]
    duree_conservation_donnee_valeur = @enrollment[:data_retention_period]
    justificatif = @enrollment[:data_retention_comment]
    sandbox_old = @enrollment[:copied_from_enrollment_id]

    linked_token_manager_id = create_enrollment_in_token_manager(
      id,
      demandeur,
      responsable_technique,
      responsable_traitement,
      dpd,
      siret,
      created_at,
      submit_event,
      validate_event,
      validated_at,
      cas_usage_libelle,
      cas_usage_detail,
      cadre_juridique_title,
      fondement_juridique_url,
      document_juridique,
      rgpd_destinataires,
      duree_conservation_donnee_valeur,
      justificatif,
      sandbox_old
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

  def create_enrollment_in_token_manager(
    id,
    demandeur,
    responsable_technique,
    responsable_traitement,
    dpd,
    siret,
    created_at,
    submit_event,
    validate_event,
    validated_at,
    cas_usage_libelle,
    cas_usage_detail,
    cadre_juridique_title,
    fondement_juridique_url,
    document_juridique,
    rgpd_destinataires,
    duree_conservation_donnee_valeur,
    justificatif,
    sandbox_old
  )

    # 1 call ApiSirene
    response = ApiSirene.call(siret)

    siren = siret.first(9)
    libelle = response[:nom_raison_sociale]
    adresse = response[:adresse]
    code_postal = response[:code_postal]
    ville = response[:libelle_commune]

    # 1.1 Get Validateur Person Siren and Info
    validateur_id = validate_event[:user_id]
    validateur = User.find_by(id: validateur_id)

    # 1.2 Transform document in URl
    unless document_juridique.nil?
      document_url = "#{ENV["BACK_HOST"]}#{document_juridique.attachment.url}"
    end
    cadre_juridique_url = fondement_juridique_url.present? ? fondement_juridique_url : document_url

    # 1.4 SandboxOld
    sandbox_copied_id = sandbox_old.present? ? sandbox_old : nil

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
      url: "#{api_dgfip_host}/contractualisation/v1/sandbox/#{id}",
      api_key: access_token,
      use_correlation_id: true,
      tag: "Api Contractualisation DGFiP (sandbox)",
      body: {
        identifiantSandBoxOld: sandbox_copied_id,
        organisation: {
          siren: siren,
          libelle: libelle,
          adresse: {
            ligne1: adresse,
            ligne2: nil,
            ligne3: nil,
            codePostal: code_postal,
            ville: ville,
            pays: "France"
          }
        },
        demande: {
          demandeur: {
            mail: demandeur[:email],
            telephone: demandeur[:phone_number].gsub(/\D+/, ""),
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
            telephone: validateur[:phone_number].gsub(/\D+/, ""),
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
          libelle: cas_usage_libelle[0..40].gsub(/\s\w+\s*$/, "..."),
          detail: cas_usage_detail
        },
        responsableTechnique: {
          mail: responsable_technique[:email],
          telephone: responsable_technique[:phone_number].gsub(/\D+/, ""),
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
          documentUrl: cadre_juridique_url,
          texteUrl: nil
        },
        attestationRGPD: true,
        rgpd: {
          destinataires: rgpd_destinataires,
          dureeConservationDonnees: {
            valeur: duree_conservation_donnee_valeur,
            unite: "mois",
            justificatif: justificatif
          },
          responsableTraitement: {
            mail: responsable_traitement[:email],
            telephone: responsable_traitement[:phone_number].gsub(/\D+/, ""),
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
            telephone: dpd[:phone_number].gsub(/\D+/, ""),
            denominationEtatCivil: {
              nom: dpd[:family_name],
              prenom: dpd[:given_name]
            },
            denominationService: dpd[:job],
            balf: nil,
            siren: nil
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
            version: "1.0",
            code: "Impôt_Particulier"
          }
        ]
      }
    })
  end
end
