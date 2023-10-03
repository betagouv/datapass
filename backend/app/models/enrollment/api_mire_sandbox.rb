class Enrollment::ApiMireSandbox < Enrollment::SandboxEnrollment
  include RequireRgpdGeneralAgreement
end
