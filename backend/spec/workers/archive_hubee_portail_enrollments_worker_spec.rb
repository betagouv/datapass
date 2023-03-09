# frozen_string_literal: true

require "rails_helper"

RSpec.describe ArchiveHubeePortailEnrollmentsWorker, type: :worker do
  subject { described_class.new }

  describe "#perform" do
    context "When there are duplicated hubee_portail enrollments" do
      before do
        create(:enrollment, :hubee_portail, :validated, organization_kind: :clamart)
        @duplicated_enrollment_1 = create(:enrollment, :hubee_portail, :submitted, organization_kind: :clamart)
        @duplicated_enrollment_2 = create(:enrollment, :hubee_portail, :draft, organization_kind: :clamart)
        @email_content = File.open(Rails.root.join("app/views/enrollment_mailer/hubee_portail/archive.text.erb")) { |f| f.readline }.chomp
      end

      it "archive enrollments" do
        result = subject.perform
        expect(result.pluck(:id, :status)).to eq([[@duplicated_enrollment_1.id, "archived"], [@duplicated_enrollment_2.id, "archived"]])
      end
    end

    context "When there are no validated hubee_portail enrollments" do
      before do
        @duplicated_enrollment_1 = create(:enrollment, :hubee_portail, :submitted, organization_kind: :clamart)
        @duplicated_enrollment_2 = create(:enrollment, :hubee_portail, :draft, organization_kind: :clamart)
      end

      it "leaves enrollments as there are" do
        result = subject.perform
        expect(result).to eq([])
      end
    end
  end
end
