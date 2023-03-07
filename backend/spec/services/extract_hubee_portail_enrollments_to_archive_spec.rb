# frozen_string_literal: true

RSpec.describe ExtractHubeePortailEnrollmentsToArchive, type: :service do
  subject { described_class.new }

  describe "#duplicated_hubee_portail_enrollments" do
    before do
      @enrollment1 = create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart) 
      @enrollment2 = create(:enrollment, :hubee_portail, :submitted, organization_kind: :clamart)
      @enrollment3 = create(:enrollment, :hubee_portail, :draft, organization_kind: :dinum)
    end

    it "returns hubee_portail invalidated enrollments which shared the same organization than an other hubee_portail validated enrollment" do
      expect(subject.duplicated_hubee_portail_enrollments).to match_array([@enrollment2])
    end
  end
end
