class Enrollment::MonComptePro < Enrollment
  protected

  def submit_validation
    super

    scopes_validation
  end
end
