# frozen_string_literal: true

class Enrollment::ApiSfipSandbox < Enrollment::SandboxEnrollment
  include DgfipValidationMethods

  protected

  def submit_validation
    super

    rgpd_general_agreement_validation
  end
end
