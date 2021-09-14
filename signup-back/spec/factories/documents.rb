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
  end
end
