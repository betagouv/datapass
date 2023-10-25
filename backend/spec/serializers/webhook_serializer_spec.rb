require "rails_helper"

RSpec.describe WebhookSerializer, type: :serializer do
  subject { described_class.new(enrollment, event, extra_data) }

  let(:enrollment) { create(:enrollment, :franceconnect, :complete) }
  let(:enrollment_serialized) { WebhookEnrollmentSerializer.new(enrollment).serializable_hash }
  let(:event) { "validated" }
  let(:extra_data) { {comment: "its ok!"} }

  before do
    Timecop.freeze
  end

  after do
    Timecop.return
  end

  describe "#serializable_hash" do
    it do
      expect(subject.serializable_hash).to eq(
        {
          event: event,
          fired_at: Time.now.to_i,
          model_type: "Pass",
          data: {
            pass: enrollment_serialized
          }.merge(extra_data)
        }
      )
    end
  end

  describe "#to_json" do
    it "renders serialized hash as json" do
      expect(subject.to_json).to eq(
        {
          event: event,
          fired_at: Time.now.to_i,
          model_type: "Pass",
          data: {
            pass: enrollment_serialized
          }.merge(extra_data)
        }.to_json
      )
    end
  end
end
