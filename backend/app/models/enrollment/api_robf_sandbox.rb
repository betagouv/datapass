class Enrollment::ApiRobfSandbox < Enrollment::AbstractDgfipSandboxEnrollment
  include RequireRgpdGeneralAgreement
end
