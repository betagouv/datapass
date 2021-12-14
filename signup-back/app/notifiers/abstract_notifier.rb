class AbstractNotifier
  attr_reader :enrollment

  def initialize(enrollment)
    @enrollment = enrollment
  end

  # :nocov:
  def create(user_id:)
    fail NotImplementedError
  end

  def update(user_id:, diff:)
    fail NotImplementedError
  end

  def team_member_update(team_member_type:)
    fail NotImplementedError
  end

  def submit(user_id:, comment:)
    fail NotImplementedError
  end

  def notify(user_id:, comment:)
    fail NotImplementedError
  end

  def request_changes(user_id:, comment:)
    fail NotImplementedError
  end

  def refuse(user_id:, comment:)
    fail NotImplementedError
  end

  def validate(user_id:, comment:)
    fail NotImplementedError
  end
  # :nocov:
end
