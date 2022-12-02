# frozen_string_literal: true

require "rails_helper"

RSpec.describe ReminderEmailWorker, type: :worker do
  # describe "#draft_enrollments" do
  #   let!(:enrollment) { create(:enrollment, :franceconnect, :draft, updated_at: Time.now - 2.months) }
  #   let!(:enrollment_1) { create(:enrollment, :api_particulier, :submitted, updated_at: Time.now - (3.months / 2.0)) }
  #   let!(:enrollment_2) { create(:enrollment, :api_entreprise, :validated, updated_at: Time.now - 30.days) }
  #   let!(:enrollment_3) { create(:enrollment, :api_particulier, :draft, updated_at: Time.now - 20.days) }
  #   let!(:enrollment_4) { create(:enrollment, :api_entreprise, :draft, updated_at: Time.now - 17.days) }
  #   let!(:enrollment_5) { create(:enrollment, :franceconnect, :draft, updated_at: Time.now - 16.days) }
  #   let!(:enrollment_6) { create(:enrollment, :api_entreprise, :draft, updated_at: Time.now - 5.days) }
  #   let!(:enrollment_7) { create(:enrollment, :api_entreprise, :draft, updated_at: Time.now) }
  #
  #   let!(:enrollment_list) { [enrollment, enrollment_1, enrollment_2, enrollment_3, enrollment_4, enrollment_5, enrollment_6, enrollment_7] }
  #
  #   context "when renders only draft enrollment" do
  #     subject { described_class.new(enrollment_list) }
  #
  #     before do
  #       Timecop.freeze
  #     end
  #
  #     after do
  #       Timecop.return
  #     end
  #
  #     it "renders only draft enrollments between 15 days and a month ago" do
  #       result = subject.draft_enrollments(enrollment_list)
  #
  #       expect(result.count).to eq(3)
  #       expect(result[0]).to eq(enrollment_3)
  #       expect(result[1]).to eq(enrollment_4)
  #       expect(result[2]).to eq(enrollment_5)
  #     end
  #   end
  # end
end
