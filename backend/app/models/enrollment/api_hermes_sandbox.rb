class Enrollment::ApiHermesSandbox < Enrollment::SandboxEnrollment
  include RequireRgpdGeneralAgreement
end
