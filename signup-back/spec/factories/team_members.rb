FactoryBot.define do
  factory :team_member do
    email

    after(:build) do |team_member|
      if team_member.user.present?
        team_member.email = team_member.user.email
      end
    end

    trait :contact_metier do
      initialize_with do
        TeamMember::ContactMetier.new(attributes)
      end

      type { "contact_metier" }
    end

    trait :delegue_protection_donnees do
      initialize_with do
        TeamMember::DelegueProtectionDonnees.new(attributes)
      end

      type { "delegue_protection_donnees" }
      phone_number { "0636656565" }
    end

    trait :demandeur do
      initialize_with do
        TeamMember::Demandeur.new(attributes)
      end

      type { "demandeur" }
    end

    trait :responsable_technique do
      initialize_with do
        TeamMember::ResponsableTechnique.new(attributes)
      end

      type { "responsable_technique" }
    end

    trait :responsable_traitement do
      initialize_with do
        TeamMember::ResponsableTraitement.new(attributes)
      end

      type { "responsable_traitement" }
      phone_number { "0636656565" }
    end

    trait :with_user do
      user { build(:user, :with_all_infos) }
    end
  end
end
