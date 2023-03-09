# frozen_string_literal: true

RSpec.describe ExtractHubeePortailEnrollmentsToArchive, type: :service do
  subject { described_class.new }

  describe "With different hubee_portail validated and invalidated enrollments from the same organizations" do
    before do
      create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart)
      @clamart_invalidated_enrollment = create(:enrollment, :hubee_portail, :submitted, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :validated, organization_kind: :dinum)
      @dinum_invalidated_enrollment = create(:enrollment, :hubee_portail, :draft, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :draft, organization_kind: :region_reunion)
    end

    it "returns invalidated enrollments which shared the same organization than an other validated enrollment" do
      expect(subject.duplicated_hubee_portail_enrollments).to match_array([@clamart_invalidated_enrollment, @dinum_invalidated_enrollment])
    end
  end

  describe "With different hubee_portail validated and invalidated enrollments from different organizations" do
    before do
      create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :submitted, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :draft, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :validated, organization_kind: :region_reunion)
    end

    it "returns invalidated enrollments which shared the same organization than an other validated enrollment" do
      expect(subject.duplicated_hubee_portail_enrollments).to match_array([])
    end
  end

  describe "With only hubee_portail invalidated enrollments" do
    before do
      create(:enrollment, :hubee_portail, :changes_requested, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :submitted, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :changes_requested, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :draft, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :draft, organization_kind: :region_reunion)
    end

    it "returns invalidated enrollments which shared the same organization than an other validated enrollment" do
      expect(subject.duplicated_hubee_portail_enrollments).to match_array([])
    end
  end

  describe "With only hubee_portail validated enrollments" do
    before do
      create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :validated, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :validated, organization_kind: :region_reunion)
    end

    it "returns invalidated enrollments which shared the same organization than an other validated enrollment" do
      expect(subject.duplicated_hubee_portail_enrollments).to match_array([])
    end
  end
end
