class Enrollment::ApiRobfSandbox < Enrollment::SandboxEnrollment
  include RequireRgpdGeneralAgreement
end
