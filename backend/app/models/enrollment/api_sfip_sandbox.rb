# frozen_string_literal: true

class Enrollment::ApiSfipSandbox < Enrollment::AbstractDgfipSandboxEnrollment
  include RequireRgpdGeneralAgreement
end
