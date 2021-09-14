class AbstractNotifier
  attr_reader :enrollment

  def initialize(enrollment)
    @enrollment = enrollment
  end

  # :nocov:
  def created
    fail NotImplementedError
  end

  def updated(diff:, user_id:)
    fail NotImplementedError
  end

  def team_member_updated(team_member_type:)
    fail NotImplementedError
  end

  def send_application(comment:, current_user:)
    fail NotImplementedError
  end

  def notify(comment:, current_user:)
    fail NotImplementedError
  end

  def review_application(comment:, current_user:)
    fail NotImplementedError
  end

  def refuse_application(comment:, current_user:)
    fail NotImplementedError
  end

  def validate_application(comment:, current_user:)
    fail NotImplementedError
  end
  # :nocov:
end
