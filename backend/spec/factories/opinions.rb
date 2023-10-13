FactoryBot.define do
  factory :opinion do
    content { "Give me an advice plz" }
    enrollment { create(:enrollment, :api_particulier) }
  end
end
