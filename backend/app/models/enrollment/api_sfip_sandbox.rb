# frozen_string_literal: true

class Enrollment::ApiSfipSandbox < Enrollment::SandboxEnrollment
  include RequireRgpdGeneralAgreement
end
