module RequireRgpdGeneralAgreement
  extend ActiveSupport::Concern

  def submit_validation
    super

    rgpd_general_agreement_validation
  end
end
