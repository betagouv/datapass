class AbstractNotifier
  attr_reader :enrollment

  def initialize(enrollment)
    @enrollment = enrollment
  end

  # :nocov:
  def create
    fail NotImplementedError
  end

  def update(diff:, user_id:)
    fail NotImplementedError
  end

  def team_member_update(team_member_type:)
    fail NotImplementedError
  end

  def submit(comment:, current_user:)
    fail NotImplementedError
  end

  def notify(comment:, current_user:)
    fail NotImplementedError
  end

  def request_changes(comment:, current_user:)
    fail NotImplementedError
  end

  def refuse(comment:, current_user:)
    fail NotImplementedError
  end

  def validate(comment:, current_user:)
    fail NotImplementedError
  end

  def revoke(comment:, current_user:)
    fail NotImplementedError
  end

  def delete
    fail NotImplementedError
  end
  # :nocov:
end
