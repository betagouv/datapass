# frozen_string_literal: true

class Enrollment::ApiImpotParticulierUnique < Enrollment::UniqueEnrollment
  protected

  def submit_validation
    super

    api_impot_particulier_scope_validation

    api_impot_particulier_acces_validation
  end
end
