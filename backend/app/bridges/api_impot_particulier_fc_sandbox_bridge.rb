# frozen_string_literal: true

class ApiImpotParticulierFcSandboxBridge < SandboxBridge
  include FcDataProviderMethods

  def version
    "1.0"
  end

  def code
    "Impôt_Particulier"
  end

  def call
    super

    notify_support_franceconnect
  end
end
