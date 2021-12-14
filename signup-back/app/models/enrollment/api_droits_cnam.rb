class Enrollment::ApiDroitsCnam < Enrollment
  protected

  def submit_validation
    super

    scopes_validation
    responsable_technique_validation
    previous_enrollment_id_validation
  end
end
