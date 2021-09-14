class WebhookSerializer
  attr_reader :enrollment,
    :event,
    :extra_data

  def initialize(enrollment, event, extra_data = {})
    @enrollment = enrollment
    @event = event
    @extra_data = extra_data
  end

  def serializable_hash
    {
      event: event,
      fired_at: now.to_i,
      model_type: "Pass",
      data: {
        pass: enrollment_serialized
      }.merge(extra_data)
    }
  end

  private

  def now
    @now ||= Time.now
  end

  def enrollment_serialized
    WebhookEnrollmentSerializer.new(enrollment).serializable_hash
  end
end
