class Enrollment::ApiImpotParticulierFcUnique < Enrollment::UniqueEnrollment
  include DgfipValidationMethods

  protected

  def submit_validation
    super

    previous_enrollment_id_validation

    api_impot_particulier_scope_validation
  end
end
