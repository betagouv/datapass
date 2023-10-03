class Enrollment::ApiOcfiSandbox < Enrollment::AbstractDgfipSandboxEnrollment
  include RequireRgpdGeneralAgreement
end
