# frozen_string_literal: true

class Enrollment::ApiImpotParticulierUnique < Enrollment::AbstractDgfipUniqueEnrollment
  protected

  def submit_validation
    super

    api_impot_particulier_scope_validation
  end
end
