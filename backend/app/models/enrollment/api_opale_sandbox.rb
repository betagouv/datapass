class Enrollment::ApiOpaleSandbox < Enrollment::SandboxEnrollment
  include RequireRgpdGeneralAgreement
end
