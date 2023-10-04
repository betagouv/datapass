class Enrollment::ApiImpotParticulierFcUnique < Enrollment::AbstractDgfipUniqueEnrollment
  protected

  def submit_validation
    super

    previous_enrollment_id_validation

    api_impot_particulier_scope_validation
  end
end
