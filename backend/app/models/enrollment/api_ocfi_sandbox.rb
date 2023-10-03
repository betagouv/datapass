class Enrollment::ApiOcfiSandbox < Enrollment::SandboxEnrollment
  include RequireRgpdGeneralAgreement
end
