# frozen_string_literal: true

RSpec.describe ExtractHubeePortailEnrollmentsToArchive, type: :service do
  subject { described_class.new }

  describe "With different hubee_portail validated and unnecessary enrollments from the same organizations" do
    before do
      create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart)
      @clamart_unnecessary_enrollment = create(:enrollment, :hubee_portail, :submitted, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :validated, organization_kind: :dinum)
      @dinum_unnecessary_enrollment = create(:enrollment, :hubee_portail, :draft, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :draft, organization_kind: :region_reunion)
      create(:enrollment, :hubee_portail, :changes_requested, organization_kind: :region_reunion)
    end

    it "returns unnecessary enrollments which shared the same organization than an other validated enrollment" do
      expect(subject.call).to match_array([@clamart_unnecessary_enrollment, @dinum_unnecessary_enrollment])
    end
  end

  describe "With different hubee_portail validated and unnecessary enrollments from different organizations" do
    before do
      create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :submitted, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :draft, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :changes_requested, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :validated, organization_kind: :region_reunion)
    end

    it "returns nothing as validated and unnecessary enrollments don't share the same organization" do
      expect(subject.call).to match_array([])
    end
  end

  describe "With only hubee_portail unnecessary enrollments" do
    before do
      create(:enrollment, :hubee_portail, :changes_requested, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :submitted, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :changes_requested, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :draft, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :draft, organization_kind: :region_reunion)
    end

    it "returns nothing as we don't have validated enrollments in these organizations" do
      expect(subject.call).to match_array([])
    end
  end

  describe "With only hubee_portail validated enrollments" do
    before do
      create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart)
      create(:enrollment, :hubee_portail, :validated, organization_kind: :dinum)
      create(:enrollment, :hubee_portail, :validated, organization_kind: :region_reunion)
    end

    it "returns nothing as there are no unnecessary enrollments" do
      expect(subject.call).to match_array([])
    end
  end
end
