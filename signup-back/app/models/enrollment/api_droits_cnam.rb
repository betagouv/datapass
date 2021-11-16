class Enrollment::ApiDroitsCnam < Enrollment
  protected

  def sent_validation
    super

    scopes_validation
    responsable_technique_validation
    previous_enrollment_id_validation
  end
end
