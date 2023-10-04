Dir[Rails.root.join("app/models/enrollment/dgfip/*.rb")].sort.each do |file|
  require file
end

Dir[Rails.root.join("app/models/enrollment/dgfip_deprecated/*.rb")].sort.each do |file|
  require file
end

FactoryBot.define do
  factory :enrollment do
    status { "draft" }
    intitule { "Intitulé" }

    trait :draft

    trait :changes_requested do
      status { "changes_requested" }
    end

    transient do
      organization_kind { :clamart }
      team_members { [] }

      user { nil }
      delegue_protection_donnees { nil }
      responsable_traitement { nil }
    end

    after(:build) do |enrollment, evaluator|
      organization = build(:organization, evaluator.organization_kind)

      enrollment.siret = organization["siret"]

      demandeur = if evaluator.user
        build(:team_member, :demandeur, user: evaluator.user, enrollment: enrollment)
      else
        build(:team_member, :demandeur, :with_user, enrollment: enrollment)
      end

      enrollment.team_members << demandeur
      demandeur.user.organizations ||= []
      demandeur.user.organizations << organization

      demandeur.user.save!

      if evaluator.team_members.any?
        evaluator.team_members.each do |team_member_payload|
          next if enrollment.team_members.where(type: team_member_payload[:type].underscore.classify).present?

          enrollment.team_members << build(
            :team_member,
            team_member_payload[:type].to_sym,
            team_member_payload.except(:type)
          )
        end
      end

      if evaluator.delegue_protection_donnees.present?
        delegue_protection_donnees = enrollment.team_members.find { |tm| tm.type == "delegue_protection_donnees" }
        enrollment.team_members.delete(delegue_protection_donnees) if delegue_protection_donnees.present?

        evaluator.delegue_protection_donnees.enrollment = enrollment
        enrollment.team_members << evaluator.delegue_protection_donnees
      end

      if evaluator.responsable_traitement.present?
        responsable_traitement = enrollment.team_members.find { |tm| tm.type == "responsable_traitement" }
        responsable_traitement.delete if responsable_traitement.present?

        evaluator.responsable_traitement.enrollment = enrollment
        enrollment.team_members << evaluator.responsable_traitement
      end

      enrollment.organization_id = organization["id"]
    end

    before(:create) do |enrollment|
      stub_api_insee_etablissement_call(enrollment.siret)
    end

    trait :complete do
      with_delegue_protection_donnees
      with_responsable_traitement
      with_data_retention
      with_technical_team

      cgu_approved { true }
      dpo_is_informed { true }

      after(:build) do |enrollment|
        enrollment.description ||= "description"
        enrollment.fondement_juridique_title ||= "title"
        enrollment.fondement_juridique_url ||= "https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000886460"
      end
    end

    trait :submitted do
      complete

      after(:create) do |enrollment|
        enrollment.update!(
          status: "submitted"
        )
      end
    end

    trait :with_technical_team do
      technical_team_type { "internal_team" }
    end

    trait :technical_team_missing do
      technical_team_type { nil }
    end

    trait :technical_team_software do
      technical_team_type { "software_company" }
      technical_team_value { "50382936800045" }
    end

    trait :technical_team_unknown_software do
      technical_team_type { "software_company" }
      technical_team_value { "hello" }
    end

    trait :with_delegue_protection_donnees do
      after(:build) do |enrollment|
        enrollment.team_members << build(:team_member, :delegue_protection_donnees, enrollment: enrollment)
      end
    end

    trait :with_responsable_traitement do
      after(:build) do |enrollment|
        enrollment.team_members << build(:team_member, :responsable_traitement, enrollment: enrollment)
      end
    end

    trait :with_data_retention do
      data_retention_period { 24 }
      data_recipients { "Agents" }
      data_retention_comment { nil }
    end

    trait :validated do
      status { "validated" }

      with_delegue_protection_donnees
      with_responsable_traitement
      with_data_retention

      cgu_approved { true }
    end

    trait :refused do
      status { "refused" }
    end

    trait :revoked do
      status { "revoked" }
    end

    trait :archived do
      status { "archived" }
    end

    trait :public do
      validated
    end

    trait :api_entreprise do
      initialize_with do
        Enrollment::ApiEntreprise.new(attributes)
      end

      target_api { "api_entreprise" }
      intitule { "Marché publics de la ville de Clamart" }

      team_members do
        [
          {
            type: "responsable_technique",
            email: "user-technique@clamart.fr",
            phone_number: "0636656565"
          },
          {
            type: "contact_metier",
            email: "user-metier@clamart.fr",
            phone_number: "0636656565"
          }
        ]
      end

      scopes do
        [
          "exercices"
        ]
      end
    end

    trait :api_particulier do
      initialize_with do
        Enrollment::ApiParticulier.new(attributes)
      end

      target_api { "api_particulier" }
      intitule { "Délivrance des titres de transport de la ville de Clamart" }
      fondement_juridique_title { "Arrêté du 8 novembre 2018" }
      fondement_juridique_url { "https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000886460" }

      scopes do
        [
          "cnaf_quotient_familial"
        ]
      end

      team_members do
        [
          {
            type: "responsable_technique",
            email: "user-technique@clamart.fr",
            phone_number: "0636656565"
          }
        ]
      end
    end

    trait :franceconnect do
      initialize_with do
        Enrollment::Franceconnect.new(attributes)
      end

      target_api { "franceconnect" }
      intitule { "Connexion aux démarches de la ville de Clamart" }
      description { "Permettre aux citoyens de se connecter sur le portail des démarches administratives" }
      fondement_juridique_title { "Arrêté du 8 novembre 2018" }
      fondement_juridique_url { "https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000000886460" }

      scopes do
        [
          "email",
          "gender",
          "openid",
          "birthdate",
          "given_name",
          "family_name",
          "birthcountry"
        ]
      end

      team_members do
        [
          {
            type: "responsable_technique",
            email: "user-technique@clamart.fr",
            phone_number: "0626656565"
          }
        ]
      end
    end

    trait :api_droits_cnam do
      initialize_with do
        Enrollment::ApiDroitsCnam.new(attributes)
      end

      previous_enrollment { create(:enrollment, :franceconnect, :validated) }

      team_members do
        [
          {
            type: "responsable_technique",
            email: "user-technique@clamart.fr",
            phone_number: "0626656565"
          }
        ]
      end

      scopes do
        [
          "cnam_caisse"
        ]
      end
    end

    trait :api_impot_particulier_sandbox do
      initialize_with do
        Enrollment::ApiImpotParticulierSandbox.new(attributes)
      end

      team_members do
        [
          {
            type: "responsable_technique",
            email: "user-technique@clamart.fr",
            phone_number: "0626656565",
            given_name: "Jean",
            family_name: "Martin"
          }
        ]
      end

      scopes do
        [
          "dgfip_annee_n_moins_1"
        ]
      end

      additional_content do
        {
          rgpd_general_agreement: true
        }
      end
    end
    trait :api_impot_particulier_fc_sandbox do
      initialize_with do
        Enrollment::ApiImpotParticulierFcSandbox.new(attributes)
      end

      previous_enrollment { create(:enrollment, :franceconnect, :validated) }

      team_members do
        [
          {
            type: "responsable_technique",
            email: "user-technique@clamart.fr",
            phone_number: "0626656565",
            given_name: "Jean",
            family_name: "Martin"
          }
        ]
      end

      scopes do
        [
          "dgfip_annee_n_moins_1"
        ]
      end

      additional_content do
        {
          rgpd_general_agreement: true
        }
      end
    end

    trait :aidants_connect do
      initialize_with do
        Enrollment::AidantsConnect.new(attributes)
      end

      type_projet { "association" }

      team_members do
        [
          {
            type: "responsable_metier",
            email: "user-metier@clamart.fr",
            phone_number: "0626656565",
            job: "Directeur",
            given_name: "Jean",
            family_name: "Dupont"
          }
        ]
      end

      documents do
        build_list(:document, 1)
      end

      additional_content do
        {
          organization_type: "Ministère",
          organization_address: "20 avenue de Ségur",
          organization_postal_code: "75007",
          organization_city: "Paris",
          participation_reseau: true,
          utilisation_identifiants_usagers: true,
          adresse_mail_professionnelle: true,
          has_professional_contact_only: true,
          has_non_elected_contact_only: true
        }
      end
    end

    trait :hubee_portail do
      initialize_with do
        Enrollment::HubeePortail.new(attributes)
      end

      scopes do
        [
          "CERTDC"
        ]
      end

      team_members do
        [
          {
            type: "responsable_metier",
            email: "user-metier@clamart.fr",
            phone_number: "0626656565",
            job: "Directeur",
            given_name: "Jean",
            family_name: "Dupont"
          }
        ]
      end
    end

    trait :hubee_portail_dila do
      initialize_with do
        Enrollment::HubeePortailDila.new(attributes)
      end

      team_members do
        [
          {
            type: "responsable_metier",
            email: "user-metier@clamart.fr",
            phone_number: "0626656565",
            job: "Directeur",
            given_name: "Jean",
            family_name: "Dupont"
          }
        ]
      end
    end

    trait :api_r2p_unique do
      initialize_with do
        Enrollment::ApiR2pUnique.new(attributes)
      end

      team_members do
        [
          {
            type: "responsable_metier",
            email: "user-metier@clamart.fr",
            phone_number: "0626656565",
            job: "Directeur",
            given_name: "Jean",
            family_name: "Dupont"
          }
        ]
      end
    end

    trait :api_e_contacts_sandbox do
      initialize_with do
        Enrollment::ApiEContactsSandbox.new(attributes)
      end

      team_members do
        [
          {
            type: "responsable_metier",
            email: "user-metier@clamart.fr",
            phone_number: "0626656565",
            job: "Directeur",
            given_name: "Jean",
            family_name: "Dupont"
          }
        ]
      end
    end
  end
end
