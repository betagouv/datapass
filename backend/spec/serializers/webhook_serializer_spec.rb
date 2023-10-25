require "rails_helper"

RSpec.describe WebhookSerializer, type: :serializer do
  describe "#serializable_hash" do
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
end
