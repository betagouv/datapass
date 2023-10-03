class Enrollment::ApiCprProSandbox < Enrollment::SandboxEnrollment
  include RequireRgpdGeneralAgreement
end
