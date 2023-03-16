# frozen_string_literal: true

require "rails_helper"

RSpec.describe ArchiveHubeePortailEnrollmentsWorker, type: :worker do
  subject { described_class.new }

  describe "#perform" do
    context "When there are duplicated hubee_portail enrollments" do
      before do
        create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart)
        create(:enrollment, :hubee_portail, :submitted, organization_kind: :clamart)
        create(:enrollment, :hubee_portail, :draft, organization_kind: :clamart)
      end

      it "archive enrollments" do
        result = subject.perform

        expect(result[0].status).to eq("archived")
        expect(result[1].status).to eq("archived")
      end

      it "creates archive events" do
        result = subject.perform

        expect(result[0].events.last.name).to eq("archive")
      end
    end

    context "When there is no hubee_portail enrollments with a 'validate' status" do
      it "returns an empty array" do
        create(:enrollment, :hubee_portail, :submitted, organization_kind: :clamart)
        create(:enrollment, :hubee_portail, :draft, organization_kind: :clamart)
        result = subject.perform

        expect(result).to eq([])
      end
    end
  end
end
