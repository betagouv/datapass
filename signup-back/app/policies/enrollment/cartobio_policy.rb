class Enrollment::CartobioPolicy < EnrollmentPolicy
  def create?
    false
  end

  def update?
    false
  end

  def destroy?
    false
  end

  def copy?
    false
  end

  def get_email_templates?
    false
  end

  def index?
    false
  end

  def permitted_attributes
    []
  end

  def submit?
    false
  end

  def notify?
    false
  end

  def validate?
    false
  end

  def request_changes?
    false
  end

  def refuse?
    false
  end
end
