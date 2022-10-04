FactoryBot.define do
  factory :document, class: Document::DelegationServicePublic do
    type { "Document::DelegationServicePublic" }

    attachable { build(:enrollment, :franceconnect) }

    transient do
      file_extension { "pdf" }
    end

    after(:build) do |document, evaluator|
      document.attachment = Rack::Test::UploadedFile.new(
        Rails.root.join(
          "spec/fixtures/dummy.#{evaluator.file_extension}"
        )
      )
    end

    trait :liste_aidants do
      initialize_with do
        Document::ListeAidants.new(attributes)
      end

      type { "Document::ListeAidants" }
    end

    trait :expression_besoin_specifique do
      initialize_with do
        Document::ExpressionBesoinSpecifique.new(attributes)
      end

      type { "Document::ExpressionBesoinSpecifique" }

      attachable { build(:enrollment, :api_impot_particulier_fc_sandbox) }

      transient do
        file_extension { "xls" }
      end
    end

    trait :geo_shape do
      initialize_with do
        Document::GeoShape.new(attributes)
      end

      type { "Document::GeoShape" }

      attachable { build(:enrollment, :franceconnect) }
    end
  end
end
