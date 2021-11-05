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

  def send_application?
    false
  end

  def notify?
    false
  end

  def validate_application?
    false
  end

  def review_application?
    false
  end

  def refuse_application?
    false
  end
end
