FactoryBot.define do
  factory :opinion do
    content { "Give me an advice plz" }
    enrollment { create(:enrollment, :api_particulier) }

    after(:build) do |opinion|
      opinion.reporter ||= build(:reporter, target_api: opinion.enrollment.target_api)
      opinion.instructor ||= build(:instructor, target_api: opinion.enrollment.target_api)
    end
  end
end
