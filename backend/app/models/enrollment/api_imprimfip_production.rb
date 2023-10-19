# frozen_string_literal: true

class Enrollment::ApiImprimfipProduction < Enrollment::AbstractDgfipProductionEnrollment
  include RequireRgpdGeneralAgreement
end
