class Enrollment::ApiHermesSandbox < Enrollment::AbstractDgfipSandboxEnrollment
  include RequireRgpdGeneralAgreement
end
