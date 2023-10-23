class EnrollmentEventsForUserQuery
  attr_reader :enrollment, :user

  def initialize(enrollment, user)
    @enrollment = enrollment
    @user = user
  end

  def perform
    if user.is_reporter?(enrollment) || user.is_instructor?(enrollment.target_api)
      base_events
    else
      base_events.where.not(name: %w[opinion_created opinion_comment_created])
    end
  end

  private

  def base_events
    enrollment.events
  end
end
