# frozen_string_literal: true

class Enrollment::ApiImprimfipSandbox < Enrollment::AbstractDgfipSandboxEnrollment
  include RequireRgpdGeneralAgreement
end
