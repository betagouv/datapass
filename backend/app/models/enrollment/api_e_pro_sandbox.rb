class Enrollment::ApiEProSandbox < Enrollment::AbstractDgfipSandboxEnrollment
  include RequireRgpdGeneralAgreement
end
