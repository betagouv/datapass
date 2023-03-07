# frozen_string_literal: true

RSpec.describe ExtractHubeePortailEnrollmentsToArchive, type: :service do
  subject { described_class.new }

  describe "#duplicated_hubee_portail_enrollments" do
    let(:enrollment_creator) { create(:user) }
    let(:enrollment1) { create(:enrollment, :hubee_portail, :validated, user: enrollment_creator) }
    let(:enrollment2) { create(:enrollment, :hubee_portail, :submitted, user: enrollment_creator) }
    let(:enrollment3) { create(:enrollment, :hubee_portail, :draft, user: enrollment_creator) }

    it "returns hubee_portail enrollments which shared the same demandeur than an other hubee_portail validated enrollment" do
      expect(subject.duplicated_hubee_portail_enrollments).to match_array([enrollment2, enrollment3])
    end
  end
end
