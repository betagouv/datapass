class Enrollment::ApiEProSandbox < Enrollment::SandboxEnrollment
  include RequireRgpdGeneralAgreement
end
